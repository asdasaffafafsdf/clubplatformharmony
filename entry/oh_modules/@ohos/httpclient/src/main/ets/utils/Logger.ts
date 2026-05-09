/*
 * Copyright (c) 2021 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import hilog from '@ohos.hilog'

const SENSITIVE_PATTERNS = [
    /\b\d{6}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}(?:\d|X|x)\b/,
    /\b\d{6}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}\b/,
    /\b\d{13,19}\b|\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4,5}\b/,
    /\b1[3-9]\d{9}\b|\b\+86\s?1[3-9]\d{9}\b/,
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
    /\b((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\b/,
    /\b([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}\b/,
    /\bhttps?:\/\/\S+\b/,
    /\b[A-Za-z0-9_\-]{20,}\b/,
    /\b[A-Za-z0-9]{32}\b/,
    /\b([A-Za-z0-9]{10,40})\b/
];

export class Logger {
    private static debugSwitch: boolean = false;
    private static domain: number = 0x0001;
    private static tag: string = 'httpclient---';
    private static FORMAT: string = `%{public}s`;

    private static filterSensitiveInfo(message: string): string {
        let filteredMessage = message;
        for (const pattern of SENSITIVE_PATTERNS) {
            filteredMessage = filteredMessage.replace(new RegExp(pattern, 'g'), '******');
        }
        return filteredMessage;
    }

    /**
     * set log switch method
     *
     * @param {boolean} debugSwitch - log switch
     */
    public static setDebugSwitch(debugSwitch: boolean) {
        this.debugSwitch = debugSwitch;
    }

    /**
     * get log switch method
     *
     * @returns debugSwitch value
     */
    public static getDebugSwitch(): boolean {
        return this.debugSwitch;
    }


    /**
     * set tag to distinguish log
     *
     * @param {string} log - Log needs to be printed
     */
    public static setTag(tagStr: string) {
        if (tagStr) {
            this.tag = tagStr;
        }
    }

    /**
     * set domain to distinguish log
     *
     * @param {string} log - Log needs to be printed
     */
    public static setDomain(domain: number) {
        this.domain = domain;
    }

    /**
     * print info level log
     *
     * @param {string} log - Log needs to be printed
     */
    public static info(...args: any) {
        if (this.debugSwitch) {
            const filteredMessage = this.filterSensitiveInfo(args.join(' '));
            hilog.info(this.domain, this.tag, this.FORMAT, filteredMessage);
        }
    }

    /**
     * print debug level log
     *
     * @param {string} log - Log needs to be printed
     */
    public static debug(...args) {
        if (this.debugSwitch) {
            const filteredMessage = this.filterSensitiveInfo(args.join(` `));
            hilog.debug(this.domain, this.tag, this.FORMAT, filteredMessage);
        }
    }

    /**
     * print error level log
     *
     * @param {string} log - Log needs to be printed
     */
    public static error(...args) {
        if (this.debugSwitch) {
            const filteredMessage = this.filterSensitiveInfo(args.join(` `));
            hilog.error(this.domain, this.tag, this.FORMAT, filteredMessage);
        }
    }

    /**
     * print warn level log
     *
     * @param {string} log - Log needs to be printed
     */
    public static warn(...args) {
        if (this.debugSwitch) {
            const filteredMessage = this.filterSensitiveInfo(args.join(` `));
            hilog.warn(this.domain, this.tag, this.FORMAT, filteredMessage);
        }
    }

    /**
     * print fatal level log
     *
     * @param {string} log - Log needs to be printed
     */
    public static fatal(...args) {
        if (this.debugSwitch) {
            const filteredMessage = this.filterSensitiveInfo(args.join(` `));
            hilog.fatal(this.domain, this.tag, this.FORMAT, filteredMessage);
        }
    }
}
