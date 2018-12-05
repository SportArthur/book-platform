import React from 'react'
import PropTypes from 'prop-types'

import {
    Modal, Form,  Button, Table,
} from 'antd';


function HistoryModal(props) {
    const {
        configHistoryVisible,
        handleCloseHistory,
        configHistoryList,
        record,
    } = props

    if(!configHistoryVisible){
        return null
    }


    const columns = [
    {
        title: '维修次数上限',
        dataIndex: 'serviceCount',
        key: 'serviceCount',
        display:false
    },
    {
        title: '报修总金额上限',
        dataIndex: 'serviceTotalAmount',
        key: 'serviceTotalAmount',
        display:false
    },{
        title: '创建时间',
        dataIndex: 'dateCreate',
        key: 'dateCreate',
    },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark',
    },{
        title: '创建人',
        dataIndex: 'creator',
        key: 'creator',
     },{
        title: '修改时间',
        dataIndex: 'dateUpdate',
        key: 'dateUpdate',
    },{
        title: '修改人',
        dataIndex: 'modifier',
        key: 'modifier',
    }];


    return (

        <div>
            <Modal
                title="质保方案预警历史记录"
                visible={configHistoryVisible}
                onCancel={handleCloseHistory}
                footer={[
                    <Button key="backHist"  type="primary"  onClick={handleCloseHistory}>关闭</Button>
                ]}
            >
                <div>
                   产品 {record.qaName}-{record.productName}
                </div>
                <div>
                    <div> 年限：{record.expiresYear}年</div>
                    <div> 价格：{record.basicPrice}元</div>
                    <div> 排量（L）：{record.engineVolumeDown}L-{record.engineVolumeUp}L</div>
                </div>

                <Table dataSource={configHistoryList} columns={columns} pagination={false}/>

            </Modal>
        </div>
    )

}

HistoryModal.propTypes = {
    record:PropTypes.object,
    configHistoryVisible: PropTypes.bool,
    handleCloseHistory: PropTypes.func,
    configHistoryList:PropTypes.array,
}


HistoryModal.defaultProps = {
    configHistoryVisible: false,
}

const WrapperedHistoryModal = Form.create()(HistoryModal);
export default WrapperedHistoryModal;
