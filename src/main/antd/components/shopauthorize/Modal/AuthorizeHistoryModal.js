import React from 'react'
import PropTypes from 'prop-types'

import {
    Modal, Form,  Button, Table,
} from 'antd';


function AuthorizeHistoryModal(props) {
    const {
        authorizeHistoryVisible,
        handleCloseHistoryAuthorize,
        productAuthorizeHistoryList,
    } = props

    if(!authorizeHistoryVisible){
        return null
    }


    const columns = [
    {
        title: '店铺编码',
        dataIndex: 'shopCode',
        key: 'shopCode',
        display:false
    },
    {
        title: '店铺名称',
        dataIndex: 'shopName',
        key: 'shopName',
        display:false
    },{
        title: '授权时间',
        dataIndex: 'dateCreate',
        key: 'dateCreate',
    },{
        title: '风险系数',
        dataIndex: 'riskRatio',
        key: 'riskRatio',
    },  {
            title: '代理商角色',
            dataIndex: 'shopRole',
            key: 'shopRole',
            display:false,
            render: (text, render) => {
                if(render.shopRole == 'general') {
                    return ('普通车商');
                }else if(render.shopRole == 'proxyMerchant') {
                    return ('代理车商');
                }else{
                    return "-"
                }
            }
        },
        {
            title: '普通车商折扣%',
            dataIndex: 'generalRoleDiscount',
            key: 'generalRoleDiscount',
            display:false
        },
        {
            title: '代理商折扣%',
            dataIndex: 'proxyMerchantRoleDiscount',
            key: 'proxyMerchantRoleDiscount',
            display:false
        },{
        title: '操作人',
        dataIndex: 'operator',
        key: 'operator',
    }];


    return (

        <div>
            <Modal
                title="质保授权记录"
                visible={authorizeHistoryVisible}
                onCancel={handleCloseHistoryAuthorize}
                footer={[
                    <Button key="backHist"  type="primary"  onClick={handleCloseHistoryAuthorize}>关闭</Button>
                ]}
            >
                <Table dataSource={productAuthorizeHistoryList} columns={columns} pagination={false}/>

            </Modal>
        </div>
    )

}

AuthorizeHistoryModal.propTypes = {
    authorizeHistoryVisible: PropTypes.bool,
    handleCloseHistoryAuthorize: PropTypes.func,
    productAuthorizeHistoryListRecord:PropTypes.array,
}


AuthorizeHistoryModal.defaultProps = {
    authorizeHistoryVisible: false,
}

const WrapperedAuthorizeHistoryModal = Form.create()(AuthorizeHistoryModal);
export default WrapperedAuthorizeHistoryModal;
