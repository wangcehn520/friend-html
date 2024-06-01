/**
 * 帖子类别
 */
export type PostsType = {
    title: string;
    content: string;
    avatarUrl?: string;
    images:string;
    userName:string;
    tags: string;
    userId: number;
    createTime: Date;
};