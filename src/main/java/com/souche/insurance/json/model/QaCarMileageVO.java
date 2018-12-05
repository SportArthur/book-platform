package com.souche.insurance.json.model;

import java.io.Serializable;
import java.util.Date;

import com.wordnik.swagger.annotations.ApiModelProperty;

import lombok.Data;

/**
 * 质保车辆表显里程VO
 * 
 * @author arthur
 *
 */
public class QaCarMileageVO implements Serializable {

	private static final long serialVersionUID = 112312312312323L;

	@ApiModelProperty("表显里程")
	private Double mileage;// 表显里程

	public Double getMileage() {
		return mileage;
	}

	public void setMileage(Double meliage) {
		this.mileage = meliage;
	}
	
}
