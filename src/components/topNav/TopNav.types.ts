export interface THeader {
    logo: string;
    title: string;
    pages?: TLinks[];
}

export interface TLinks {
    title: string;
    url: string;
}