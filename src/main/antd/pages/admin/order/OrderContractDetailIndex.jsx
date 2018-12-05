import React from 'react';
import ReactDom from 'react-dom';
import SADPage from '@souche-f2e/sad';
import '../../../styles/index.less';
/*
 * 这里声明要引入的组件
 */
import { Form} from 'antd';



/**
 * 合同详情页面
 */
class OrderContractDetailIndex extends SADPage {
    constructor() {
        super();
        this.state = {
            productForAdd:{},
            query:{},
            status: {}
        }
    }
    /**
     * 搜索查询
     * @param e
     */
    handSubmit = (e) => {
        this.props.form.validateFieldsAndScroll((errors, values) => {
            if (!!errors) {
                return;
            }
            let query = this.props.form.getFieldsValue();
            this.state.query = query;
            this.state.page = 1;
            this.getList();
        })
    }

    /**
     *
     * @returns {*}
     */
    render() {

        if (this.stateAlready) {
            let imgUrls = this.state.list;
            let imgs = [];
            if(imgUrls){
                for(var i = 0 ; i< imgUrls.length ; i++){
                    var imgTemp = imgUrls[i];
                    imgs.push(<img src={imgTemp} style={{width: '70%',height: '70%'}}/>);
                }
            }else{
                alert("详情图片不存在！");
            }


            return (
                <div>
                    <div>
                        <div >
                            <h1 style={{marginLeft:'4%'}}>质保-客户订单合同详情</h1>
                            {imgs}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

}

OrderContractDetailIndex = Form.create()(OrderContractDetailIndex);
ReactDom.render(<div><OrderContractDetailIndex></OrderContractDetailIndex></div>, document.querySelector("#content"));
