import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent, SoftRemoveEvent } from 'typeorm'
import { ClsServiceManager } from 'nestjs-cls'

@EventSubscriber()
export class AuditSubscriber implements EntitySubscriberInterface {
    /**
     * 插入前自动填充 created_by / updated_by
     */
    beforeInsert(event: InsertEvent<any>) {
        const username = ClsServiceManager.getClsService().get('username') || 'system'
        if ('createdBy' in event.entity) event.entity.createdBy = username
        if ('updatedBy' in event.entity) event.entity.updatedBy = username
    }

    /**
     * 更新前自动填充 updated_by
     */
    beforeUpdate(event: UpdateEvent<any>) {
        const username = ClsServiceManager.getClsService().get('username') || 'system'
        if (event.entity && 'updatedBy' in event.entity) {
            event.entity.updatedBy = username
        }
    }

    /**
     * 软删除时自动记录 deleted_by（如有该字段）
     */
    beforeSoftRemove(event: SoftRemoveEvent<any>) {
        const username = ClsServiceManager.getClsService().get('username') || 'system'
        if (event.entity && 'deletedBy' in event.entity) {
            event.entity.deletedBy = username
        }
    }
}
