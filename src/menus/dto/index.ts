import { PartialType } from '@nestjs/mapped-types'
import { Type } from 'class-transformer'
import { IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Min } from 'class-validator'

export class CreateMenuDto {
    @IsNumber()
    @IsOptional()
    parentId?: number

    @IsString()
    @IsNotEmpty()
    @Length(1, 20, {
        message: `菜单名长度必须在$constraint1和$constraint2之间,当前传递的值是: $value`,
    })
    name: string

    @IsString()
    @IsOptional()
    icon?: string

    @IsString()
    @IsOptional()
    path?: string

    @IsString()
    @IsOptional()
    query?: string

    @IsString()
    @IsOptional()
    componentPath?: string

    @IsNumber()
    @IsIn([0, 1])
    status: number

    @IsNumber()
    @IsOptional()
    @IsIn([0, 1, 2])
    menuType: number

    @IsNumber()
    @IsNotEmpty()
    orderNumber: number

    @IsString()
    @IsOptional()
    permissions?: string
}
export class UpdateMenuDto extends PartialType(CreateMenuDto) {}

// export class UpdateMenuDto {
//     @IsNumber()
//     @IsOptional()
//     parentId?: number

//     @IsString()
//     @IsOptional()
//     @Length(1, 20)
//     name?: string

//     @IsString()
//     @IsOptional()
//     icon?: string

//     @IsString()
//     @IsOptional()
//     path?: string

//     @IsString()
//     @IsOptional()
//     query?: string

//     @IsString()
//     @IsOptional()
//     componentPath?: string

//     @IsNumber()
//     @IsIn([0, 1])
//     status?: number

//     @IsNumber()
//     @IsOptional()
//     @IsIn([0, 1, 2])
//     menuType?: number

//     @IsNumber()
//     @IsOptional()
//     orderNumber?: number

//     @IsString()
//     @IsOptional()
//     permissions?: string
// }

export class GetMenuDto {
    @IsString()
    @IsOptional()
    name?: string

    @IsOptional()
    @Type(() => Number) // 类型转换
    @IsNumber()
    @IsIn([0, 1])
    status?: number

    @IsNumber()
    @IsOptional()
    parentId?: number
}
