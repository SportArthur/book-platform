package com.souche.insurance.json.model;

import java.io.Serializable;
import java.util.Date;

import com.wordnik.swagger.annotations.ApiModelProperty;

import lombok.Data;

/**
 * 质保订单详情VO
 * 
 * @author arthur
 *
 */
@Data
public class QaShopContractVO implements Serializable {

	private static final long serialVersionUID = 112312312312323L;

	@ApiModelProperty("合同编号")
	private Long contractId;// 主键
	@ApiModelProperty("合同中心合同号")
	private String contractSerialNumber;// 合同中心合同号
	@ApiModelProperty("店铺编码")
	private String shopCode;// 店铺编码
	@ApiModelProperty("车商名称")
	private String shopName;// 车商名称
	@ApiModelProperty("签署电话")
	private String signPhone;// 签署电话
	@ApiModelProperty("合同类型")
	private Short contractType;// 合同类型 DEFAULT 1 (1销售中规车质保（二手车）质保合同,2销售平行进口车质保合同,3,) @see QaShopContractTypeEnum

	@ApiModelProperty("创建时间")
	protected Date dateCreate;// 创建时间

	@ApiModelProperty("修改时间")
	protected Date dateUpdate;// 修改时间

	@ApiModelProperty("到期时间")
	protected Date dateEnd;// 到期时间
	
}
