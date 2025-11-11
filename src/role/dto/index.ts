import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'
import { PartialType } from '@nestjs/mapped-types'

export class CreateRoleDto {
    @IsNotEmpty({ message: '角色名称不能为空' })
    @IsString({ message: '角色名称必须是字符串' })
    name: string

    @IsOptional()
    @Type(() => Number)
    @Min(0, { message: '排序号不能小于0' })
    orderNumber: number = 0 // 默认值

    @IsOptional()
    @Type(() => Number)
    @IsInt({ message: '状态必须是整数' })
    @Min(0, { message: '状态值不能小于0' })
    @Max(1, { message: '状态值不能大于1' }) // 假设 0-禁用, 1-启用
    status: number = 1 // 默认启用

    @IsOptional()
    @IsArray({ message: '菜单必须是一个数组' })
    @IsNumber({}, { each: true, message: '每个菜单ID必须是数字' })
    menuIds?: number[] // 关联的菜单ID数组
}

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsOptional()
    @IsArray({ message: '菜单必须为一个数组' })
    @IsNumber({}, { each: true, message: '每个菜单ID必须是数字' })
    menuIds?: number[] // 菜单ID数组
}
