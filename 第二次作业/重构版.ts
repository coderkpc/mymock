interface UploadTask {
    fileName: string;
    uploadFunction: Function;
}

interface UploadPolicy {
    ext: string;
    uploadFunction: Function;
}
/** 外部接口 start **/
function uploadByFtp(file: string): Promise<boolean> {
    return new Promise(resolve => resolve(true));
}
function uploadBySftp(file: string[], cb: (ret: boolean) => void): void {
    cb(true);
}
function uploadByHttp(file: string): boolean {
    return true;
}
/** 外部接口 end **/

/**
 * @description 上传方法映射
 */
const uploadFunctionMap: Record<string, Function> = {
    ftp: (file: string) => {
        return Promise.resolve(uploadByFtp(file));
    },
    sftp: (file: string) => {
        return new Promise((resolve, reject) => {
            uploadBySftp([file], ret => {
                if (ret) {
                    resolve(true);
                } else {
                    reject();
                }
            });
        });
    },
    http: (file: string) => {
        return Promise.resolve(uploadByHttp(file));
    },
};

/**
 * @description 上传策略
 */
const uploadPolicy: UploadPolicy[] = [
    {
        ext: 'txt',
        uploadFunction: uploadFunctionMap.ftp,
    },
    {
        ext: 'txt',
        uploadFunction: uploadFunctionMap.sftp,
    },
    {
        ext: 'exe',
        uploadFunction: uploadFunctionMap.sftp,
    },
    {
        ext: 'doc',
        uploadFunction: uploadFunctionMap.http,
    },
];

/**
 * @description 获取文件后缀名
 * @param file 文件名
 * @returns 文件后缀名
 * @example
 * getFileExt('a.txt'); // txt
 * getFileExt('b.exe'); // exe
 * getFileExt('c.doc'); // doc
 */
function getFileExt(file: string): string {
    return file.match(/\.(\w+)$/)?.[0].split('.')[1] || '';
}

/**
 * @description 根据文件后缀名，生成上传任务
 * @param files 需要上传的文件数组
 * @returns 上传任务数组
 * @example
 * const files: string[] = ['a.txt', 'b.exe', 'c.doc'];
 * const result = generateUploadTasks(files);
 * console.log(result);
 * // [
 * //     { fileName: 'a.txt', ext: 'txt', uploadFunction: [Function: uploadByFtp] },
 * //     { fileName: 'a.txt', ext: 'txt', uploadFunction: [Function: uploadBySftp] },
 * //     { fileName: 'b.exe', ext: 'exe', uploadFunction: [Function: uploadBySftp] },
 * //     { fileName: 'c.doc', ext: 'doc', uploadFunction: [Function: uploadByHttp] }
 * // ]
 */
function generateUploadTasks(files: string[]): UploadTask[] {
    const uploadTasks: UploadTask[] = [];
    files.forEach(file => {
        // 获取文件后缀名
        const ext = getFileExt(file);
        // 根据文件后缀名，获取上传策略
        uploadTasks.push(
            ...uploadPolicy
                .map(policy => {
                    return {
                        fileName: file,
                        ...policy,
                    };
                })
                .filter(policy => policy.ext === ext),
        );
    });
    return uploadTasks;
}

/**
 * @description 上传文件
 * @param uploadTasks 上传任务
 * @returns 上传结果
 */
async function upload(uploadTasks: UploadTask[]) {
    // 上传文件
    const result = await Promise.allSettled(
        uploadTasks.map(async ({ fileName, uploadFunction }) => {
            try {
                const success = await uploadFunction(fileName);
                return {
                    fileName,
                    success,
                };
            } catch (err) {
                console.error(`${fileName} upload failed.The Reason is ${err}}`);
                return {
                    fileName,
                    success: false,
                    err,
                };
            }
        }),
    );
    console.log('All files uploaded success.');
    return result;
}

const files: string[] = ['a.txt', 'b.exe', 'c.doc'];
// 生成上传任务
const uploadTasks = generateUploadTasks(files);
// 执行上传
upload(uploadTasks); // All files uploaded success.
// [
//     { status: 'fulfilled', value: { fileName: 'a.txt', success: true } },
//     { status: 'fulfilled', value: { fileName: 'a.txt', success: true } },
//     { status: 'fulfilled', value: { fileName: 'b.exe', success: true } },
//     { status: 'fulfilled', value: { fileName: 'c.doc', success: true } }
// ]
