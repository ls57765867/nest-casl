export interface getUsersDto {
    page: number
    limit?: number
    username?: string
    role?: number
    gender?: number
}

export interface updateUserDto {
    username: string
    password: string
}

export interface addUserDto {
    username: string
    password: string
}
