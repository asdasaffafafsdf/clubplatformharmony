from flask import Flask, request, jsonify, Response
import requests
from flask_cors import CORS  # 解决跨域问题
from datetime import datetime
import mysql.connector
from mysql.connector import Error
import hashlib
import json
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 数据库配置
DB_CONFIG = {
    'host': 'localhost',
    'database': 'club_platform1',
    'user': 'root',
    'password': '1234'  # mysql 密码
}

def get_conn():
    return mysql.connector.connect(**DB_CONFIG)

def hash_password(password):
    """简单的密码哈希函数"""
    return hashlib.sha256(password.encode()).hexdigest()

def convert_datetime_to_str(obj):
    """递归将对象中的 datetime 转换为字符串"""
    if isinstance(obj, dict):
        return {key: convert_datetime_to_str(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_datetime_to_str(item) for item in obj]
    elif isinstance(obj, datetime):
        return obj.isoformat()
    else:
        return obj

# 统一响应格式
def make_response(code, msg, data=None):
    response_data = {
        "code": code,
        "msg": msg,
        "data": convert_datetime_to_str(data) if data is not None else None
    }
    return jsonify(response_data)


# 配置硅基流动 API 信息
API_URL = "https://api.siliconflow.cn/v1/chat/completions"
API_KEY = "sk-zetidcufzsigouymcygovuyezsrnrphasssnrmrhvuxolmrj" 
Enable_think=False

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        user_content = request.json.get('content', '')
        print("前端传来的消息：", user_content)

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {API_KEY}"
        }

        data = {
            "model": "Qwen/Qwen3.6-27B",
            "max_tokens": 500,
            "enable_thinking":Enable_think,
            "messages": [
                {"role": "system", "content": "你是一个社团活动管理助手，能帮助用户解决社团活动中发送的问题"},
                {"role": "user", "content": "你是一个社团活动管理助手，能帮助用户解决社团活动中发送的问题"+user_content}
            ]
        }

        res = requests.post(API_URL, headers=headers, json=data)
        print("✅ AI 原始返回：", res.text)

        resJson = res.json()
        content = resJson['choices'][0]['message']['content']
        
        # full_content = resJson['choices'][0]['message']['content']
        # if '' in full_content:
        #     # 有思考过程，只保留后面的回答
        #     content = full_content.split('')[-1].strip()
        # else:
        #     # 没有思考过程，直接用
        #     content = full_content.strip()
    
        print("✅ AI 最终回复：", content)
        return make_response(200, "成功", {"text": content})

    except Exception as e:
        print("❌ 后端报错：", str(e))
        return make_response(500, str(e), None), 500


# 用户认证 API
@app.route('/api/login', methods=['POST'])
def login():
    try:
        # 获取原始数据
        raw_data = request.get_data(as_text=True)
        print(f"Raw login request data: {raw_data}")
        
        # 解析 JSON 数据
        data = json.loads(raw_data) if raw_data else {}
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return make_response(1, "用户名和密码不能为空")
        
        conn = get_conn()
        cur = conn.cursor(dictionary=True)
        
        # 查询用户
        cur.execute("SELECT id, username, password FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        
        if user and user['password'] == hash_password(password):
            cur.close()
            conn.close()
            return make_response(0, "登录成功", {"id": user['id'], "username": user['username']})
        else:
            cur.close()
            conn.close()
            return make_response(1, "用户名或密码错误")
    except json.JSONDecodeError:
        return make_response(1, "无效的 JSON 数据")
    except Exception as e:
        print(f"Login error: {str(e)}")
        try:
            cur.close()
            conn.close()
        except:
            pass
        return make_response(1, f"服务器内部错误：{str(e)}")

# 新增：成员登录 API
@app.route('/api/member-login', methods=['POST'])
def member_login():
    try:
        # 获取原始数据
        raw_data = request.get_data(as_text=True)
        print(f"Raw member login request data: {raw_data}")
        
        # 解析 JSON 数据
        data = json.loads(raw_data) if raw_data else {}
        username = data.get('username')
        studentId = data.get('studentId')  # 学号
        
        if not username or not studentId:
            return make_response(1, "用户名和学号不能为空")
        
        conn = get_conn()
        cur = conn.cursor(dictionary=True)
        
        # 查询成员用户（从 members 表中查找）
        cur.execute("""
            SELECT m.id, m.name as username, m.student_id, m.club_id, c.name as club_name
            FROM members m
            JOIN clubs c ON m.club_id = c.id
            WHERE m.name = %s AND m.student_id = %s
        """, (username, studentId))
        user = cur.fetchone()
        
        if user:
            cur.close()
            conn.close()
            return make_response(0, "登录成功", {
                "id": user['id'], 
                "username": user['username'],
                "student_id": user['student_id'],
                "club_id": user['club_id'],
                "club_name": user['club_name']
            })
        else:
            cur.close()
            conn.close()
            return make_response(1, "用户不存在或信息不匹配")
    except json.JSONDecodeError:
        return make_response(1, "无效的 JSON 数据")
    except Exception as e:
        print(f"Member login error: {str(e)}")
        try:
            cur.close()
            conn.close()
        except:
            pass
        return make_response(1, f"服务器内部错误：{str(e)}")

@app.route('/api/register', methods=['POST'])
def register():
    try:
        # 获取原始数据
        raw_data = request.get_data(as_text=True)
        print(f"Raw register request data: {raw_data}")
        
        # 解析 JSON 数据
        data = json.loads(raw_data) if raw_data else {}
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return make_response(1, "用户名和密码不能为空")
        
        if len(username) < 3 or len(password) < 6:
            return make_response(1, "用户名至少 3 位，密码至少 6 位")
        
        conn = get_conn()
        cur = conn.cursor()
        
        # 检查用户名是否已存在
        cur.execute("SELECT id FROM users WHERE username = %s", (username,))
        existing_user = cur.fetchone()
        
        if existing_user:
            cur.close()
            conn.close()
            return make_response(1, "用户名已存在")
        
        # 插入新用户
        hashed_password = hash_password(password)
        cur.execute("INSERT INTO users(username, password, created_at) VALUES(%s, %s, %s)", 
                (username, hashed_password, datetime.now()))
        conn.commit()
        
        user_id = cur.lastrowid
        
        cur.close()
        conn.close()
        
        return make_response(0, "注册成功", {"id": user_id, "username": username})
    except json.JSONDecodeError:
        return make_response(1, "无效的 JSON 数据")
    except Exception as e:
        print(f"Registration error: {str(e)}")
        try:
            cur.close()
            conn.close()
        except:
            pass
        return make_response(1, f"服务器内部错误：{str(e)}")

# 会员管理 API
@app.route('/api/members', methods=['GET'])
def get_members():
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    
    try:
        club_id = request.args.get('club_id')
        if club_id:
            cur.execute("SELECT * FROM members WHERE club_id = %s", (club_id,))
        else:
            cur.execute("SELECT * FROM members")
        
        members = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "获取成功", "data": members})
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

@app.route('/api/members', methods=['POST'])
def add_member():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # 验证必需字段
        required_fields = ['name', 'student_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        # 检查社团是否存在
        cur.execute("SELECT id FROM clubs WHERE id = %s", (data.get('club_id', 1),))
        club_exists = cur.fetchone()
        
        if not club_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": f"指定的社团 ID 不存在：{data.get('club_id', 1)}，请先创建社团"})
        
        # 检查学号是否已在该社团中存在
        cur.execute("SELECT id FROM members WHERE student_id = %s AND club_id = %s", 
                   (data['student_id'], data.get('club_id', 1)))
        existing_member = cur.fetchone()
        
        if existing_member:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "该学号在此社团中已存在"})
        
        cur.execute("""
            INSERT INTO members(club_id, name, student_id, phone, role) 
            VALUES(%s, %s, %s, %s, %s)
        """, (
            data.get('club_id', 1),
            data['name'],
            data['student_id'],
            data.get('phone', ''),
            data.get('role', 'member')
        ))
        conn.commit()
        
        # 获取插入的成员 ID
        member_id = cur.lastrowid
        
        cur.execute("SELECT id, name, student_id, phone, role, created_at FROM members WHERE id = %s", (member_id,))
        new_member = cur.fetchone()
        
        # 将 tuple 转换为字典
        if new_member:
            new_member_dict = {
                'id': new_member[0],
                'name': new_member[1],
                'student_id': new_member[2],
                'phone': new_member[3],
                'role': new_member[4],
                'created_at': new_member[5].isoformat() if new_member[5] else None
            }
        else:
            new_member_dict = None
            
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "添加成功", "data": new_member_dict})
    except mysql.connector.IntegrityError as e:
        print(f"IntegrityError: {str(e)}")
        cur.close()
        conn.close()
        if "uk_student_club" in str(e):
            return jsonify({"code": 1, "msg": "该学号在此社团中已存在"})
        else:
            return jsonify({"code": 1, "msg": f"数据库约束错误：{str(e)}"})
    except Exception as e:
        print(f"General error: {str(e)}")
        try:
            cur.close()
            conn.close()
        except:
            pass
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 社团管理 API
@app.route('/api/clubs', methods=['GET'])
def get_clubs():
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    
    try:
        cur.execute("SELECT * FROM clubs")
        clubs = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "获取成功", "data": clubs})
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

@app.route('/api/clubs', methods=['POST'])
def add_club():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # 验证必需字段
        required_fields = ['name', 'description']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        cur.execute("""
            INSERT INTO clubs(name, description, created_at) 
            VALUES(%s, %s, %s)
        """, (
            data['name'],
            data['description'],
            datetime.now()
        ))
        conn.commit()
        
        # 获取插入的社团 ID
        club_id = cur.lastrowid
        
        cur.execute("SELECT id, name, description, created_at FROM clubs WHERE id = %s", (club_id,))
        new_club = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "添加成功", "data": new_club})
    except Exception as e:
        print(f"Error adding club: {str(e)}")
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 活动管理 API
@app.route('/api/events', methods=['GET'])
def get_events():
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    
    try:
        club_id = request.args.get('club_id')
        if club_id:
            cur.execute("""
            SELECT e.*, COUNT(es.member_id) as signup_count
            FROM events e
            LEFT JOIN event_signups es ON e.id = es.event_id
            WHERE e.club_id = %s
            GROUP BY e.id
            """, (club_id,))
        else:
            cur.execute("""
            SELECT e.*, COUNT(es.member_id) as signup_count
            FROM events e
            LEFT JOIN event_signups es ON e.id = es.event_id
            GROUP BY e.id
            """)
        events = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "获取成功", "data": events})
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

@app.route('/api/events', methods=['POST'])
def add_event():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # 验证必需字段
        required_fields = ['title', 'content', 'start_time', 'end_time', 'location']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        # cur.execute("""
        #     INSERT INTO events(title, content, start_time, end_time, location, status) 
        #     VALUES(%s, %s, %s, %s, %s, %s)
        # """, (
        #     data['title'],
        #     data['content'],
        #     data['start_time'],
        #     data['end_time'],
        #     data['location'],
        #     data.get('status', 'draft'),
        #     data['club_id']
        # ))

        # 修复：加上 club_id 字段
        cur.execute("""
            INSERT INTO events(title, content, start_time, end_time, location, status, club_id) 
            VALUES(%s, %s, %s, %s, %s, %s, %s)
        """, (
            data['title'],
            data['content'],
            data['start_time'],
            data['end_time'],
            data['location'],
            data.get('status', 'draft'),
            data['club_id']  # 现在 7 个字段 ↔ 7 个值，匹配了
        ))
        conn.commit()
        
        # 获取插入的活动 ID
        event_id = cur.lastrowid
        
        cur.execute("SELECT * FROM events WHERE id = %s", (event_id,))
        new_event = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "添加成功", "data": new_event})
    except Exception as e:
        print(f"Error adding event: {str(e)}")
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 报名管理 API
@app.route('/api/event_signups', methods=['GET'])
def get_event_signups():
    conn = get_conn()
    cur = conn.cursor(dictionary=True)
    
    try:
        event_id = request.args.get('event_id')
        if event_id:
            cur.execute("""
                SELECT es.*, m.name, m.student_id, e.title
                FROM event_signups es
                JOIN members m ON es.member_id = m.id
                JOIN events e ON es.event_id = e.id
                WHERE es.event_id = %s
            """, (event_id,))
        else:
            cur.execute("""
                SELECT es.*, m.name, m.student_id, e.title
                FROM event_signups es
                JOIN members m ON es.member_id = m.id
                JOIN events e ON es.event_id = e.id
            """)
        
        signups = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "获取成功", "data": signups})
    except Exception as e:
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

@app.route('/api/event_signups', methods=['POST'])
def signup_for_event():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # 验证必需字段
        required_fields = ['event_id', 'member_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        # 检查活动是否存在
        cur.execute("SELECT id FROM events WHERE id = %s", (data['event_id'],))
        event_exists = cur.fetchone()
        if not event_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的活动不存在"})
        
        # 检查成员是否存在
        cur.execute("SELECT id FROM members WHERE id = %s", (data['member_id'],))
        member_exists = cur.fetchone()
        if not member_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的成员不存在"})
        
        # 检查是否已报名
        cur.execute("SELECT id FROM event_signups WHERE event_id = %s AND member_id = %s", 
                   (data['event_id'], data['member_id']))
        existing_signup = cur.fetchone()
        if existing_signup:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "该成员已报名此活动"})
        
        cur.execute("""
            INSERT INTO event_signups(event_id, member_id, sign_up_time) 
            VALUES(%s, %s, %s)
        """, (
            data['event_id'],
            data['member_id'],
            datetime.now()
        ))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "报名成功"})
    except Exception as e:
        print(f"Error signing up for event: {str(e)}")
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 签到管理 API
@app.route('/api/checkin', methods=['POST'])
def checkin():
    try:
        data = request.json
        print(f"Received data: {data}")
        
        # 验证必需字段
        required_fields = ['event_id', 'member_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        # 检查活动是否存在
        cur.execute("SELECT id FROM events WHERE id = %s", (data['event_id'],))
        event_exists = cur.fetchone()
        if not event_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的活动不存在"})
        
        # 检查成员是否存在
        cur.execute("SELECT id FROM members WHERE id = %s", (data['member_id'],))
        member_exists = cur.fetchone()
        if not member_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的成员不存在"})
        
        # 检查是否已签到
        cur.execute("SELECT id FROM check_ins WHERE event_id = %s AND member_id = %s", 
                   (data['event_id'], data['member_id']))
        existing_checkin = cur.fetchone()
        if existing_checkin:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "该成员已签到"})
        
        # 检查是否已报名
        cur.execute("SELECT id FROM event_signups WHERE event_id = %s AND member_id = %s", 
                   (data['event_id'], data['member_id']))
        signup_exists = cur.fetchone()
        if not signup_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "该成员未报名此活动，无法签到"})
        
        cur.execute("""
            INSERT INTO check_ins(event_id, member_id, check_in_time, status) 
            VALUES(%s, %s, %s, %s)
        """, (
            data['event_id'],
            data['member_id'],
            datetime.now(),
            1  # 签到状态
        ))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "签到成功"})
    except Exception as e:
        print(f"Error checking in: {str(e)}")
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 【新增】获取所有报名记录的 API - 用于签到管理页面
@app.route('/api/event_signups_all', methods=['GET'])
def get_all_event_signups():
    conn = get_conn()
    cur = conn.cursor()
    
    try:
        # 查询所有报名记录及签到状态
        cur.execute("""
            SELECT 
                es.event_id,
                es.member_id,
                m.name,
                m.student_id,
                e.title,
                es.sign_up_time,
                COALESCE(ci.status, 0) as checkin_status,
                ci.check_in_time as checkin_time
            FROM event_signups es
            JOIN members m ON es.member_id = m.id
            JOIN events e ON es.event_id = e.id
            LEFT JOIN check_ins ci ON es.event_id = ci.event_id AND es.member_id = ci.member_id
            ORDER BY es.sign_up_time DESC
        """)
        
        records = cur.fetchall()
        
        signups = []
        for record in records:
            signups.append({
                'event_id': record[0],
                'member_id': record[1],
                'name': record[2],
                'student_id': record[3],
                'title': record[4],
                'sign_up_time': record[5].isoformat() if record[5] else None,
                'checkin_status': record[6],
                'checkin_time': record[7].isoformat() if record[7] and record[7] else None
            })
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "获取成功", "data": signups})
    except Exception as e:
        cur.close()
        conn.close()
        print(f"Error getting all event signups: {str(e)}")
        return jsonify({"code": 1, "msg": f"获取失败：{str(e)}"})

# 【新增】成员加入社团 API
@app.route('/api/join-club', methods=['POST'])
def join_club():
    try:
        data = request.json
        print(f"Received join club data: {data}")
        
        # 验证必需字段
        required_fields = ['member_id', 'club_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        # 检查社团是否存在
        cur.execute("SELECT id FROM clubs WHERE id = %s", (data['club_id'],))
        club_exists = cur.fetchone()
        if not club_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的社团不存在"})
        
        # 检查成员是否存在
        cur.execute("SELECT id FROM members WHERE id = %s", (data['member_id'],))
        member_exists = cur.fetchone()
        if not member_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的成员不存在"})
        
        # 检查成员是否已在社团中
        cur.execute("SELECT id FROM members WHERE id = %s AND club_id = %s", 
                   (data['member_id'], data['club_id']))
        existing_member = cur.fetchone()
        if existing_member:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "该成员已在社团中"})
        
        # 更新成员的社团 ID
        cur.execute("UPDATE members SET club_id = %s WHERE id = %s", 
                   (data['club_id'], data['member_id']))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "加入社团成功"})
    except Exception as e:
        print(f"Error joining club: {str(e)}")
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 【新增】成员签到 API（限制只能为自己签到）
@app.route('/api/member-checkin', methods=['POST'])
def member_checkin():
    try:
        data = request.json
        print(f"Received member checkin data: {data}")
        
        # 验证必需字段
        required_fields = ['event_id', 'member_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"code": 1, "msg": f"缺少必需字段：{field}"})
        
        conn = get_conn()
        cur = conn.cursor()
        
        # 检查活动是否存在
        cur.execute("SELECT id FROM events WHERE id = %s", (data['event_id'],))
        event_exists = cur.fetchone()
        if not event_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "指定的活动不存在"})
        
        # 检查成员是否存在且属于对应社团
        cur.execute("""
            SELECT m.id, e.club_id
            FROM members m
            JOIN events e ON m.club_id = e.club_id
            WHERE m.id = %s AND e.id = %s
        """, (data['member_id'], data['event_id']))
        member_exists = cur.fetchone()
        if not member_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "成员不属于该活动所属社团，无法签到"})
        
        # 检查是否已签到
        cur.execute("SELECT id FROM check_ins WHERE event_id = %s AND member_id = %s", 
                   (data['event_id'], data['member_id']))
        existing_checkin = cur.fetchone()
        if existing_checkin:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "您已签到"})
        
        # 检查是否已报名
        cur.execute("SELECT id FROM event_signups WHERE event_id = %s AND member_id = %s", 
                   (data['event_id'], data['member_id']))
        signup_exists = cur.fetchone()
        if not signup_exists:
            cur.close()
            conn.close()
            return jsonify({"code": 1, "msg": "您未报名此活动，无法签到"})
        
        cur.execute("""
            INSERT INTO check_ins(event_id, member_id, check_in_time, status) 
            VALUES(%s, %s, %s, %s)
        """, (
            data['event_id'],
            data['member_id'],
            datetime.now(),
            1  # 签到状态
        ))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"code": 0, "msg": "签到成功"})
    except Exception as e:
        print(f"Error member checking in: {str(e)}")
        cur.close()
        conn.close()
        return jsonify({"code": 1, "msg": f"服务器内部错误：{str(e)}"})

# 成员审核页面查询
@app.route('/api/member_check/search', methods=['GET'])
def member_check_search():

    conn = get_conn()
    cur = conn.cursor(dictionary=True)

    try:

        name = request.args.get('name', '').strip()

        sql = """
            SELECT
                id,
                name,
                student_id
            FROM members
            WHERE name LIKE %s
            ORDER BY id DESC
        """

        cur.execute(sql, (f"%{name}%",))

        data = cur.fetchall()

        cur.close()
        conn.close()

        return jsonify({
            "code": 0,
            "msg": "查询成功",
            "data": data
        })

    except Exception as e:

        cur.close()
        conn.close()

        return jsonify({
            "code": 1,
            "msg": str(e)
        })
    

# 修改成员社团账号
@app.route('/api/member_check/update/<int:id>', methods=['PUT'])
def member_check_update(id):

    conn = get_conn()
    cur = conn.cursor()

    try:

        data = request.json

        student_id = data.get('student_id', '').strip()

        sql = """
            UPDATE members
            SET student_id = %s
            WHERE id = %s
        """

        cur.execute(sql, (student_id, id))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "code": 0,
            "msg": "修改成功"
        })

    except Exception as e:

        cur.close()
        conn.close()

        return jsonify({
            "code": 1,
            "msg": str(e)
        })
    

# 删除成员
@app.route('/api/member_check/delete/<int:id>', methods=['DELETE'])
def member_check_delete(id):

    conn = get_conn()
    cur = conn.cursor()

    try:

        sql = "DELETE FROM members WHERE id = %s"

        cur.execute(sql, (id,))

        conn.commit()

        cur.close()
        conn.close()

        return jsonify({
            "code": 0,
            "msg": "删除成功"
        })

    except Exception as e:

        cur.close()
        conn.close()

        return jsonify({
            "code": 1,
            "msg": str(e)
        })
    





if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)