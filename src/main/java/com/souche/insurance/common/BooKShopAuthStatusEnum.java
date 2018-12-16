package com.souche.insurance.common;

/**
 * 授权状态枚举 0：未授权，1：已授权 2：已取消
 * 
 * @author : Arthur
 * @date 创建时间：Dec 8, 2018 12:26:36 PM
 */
public enum BooKShopAuthStatusEnum {
	
	NOT_AUTH(0, "未授权"), 
	AUTHORIZED(1, "已授权"), 
	CANCELED(2, "已取消");

	private int status;

	private String meaning;

	BooKShopAuthStatusEnum(int status, String meaning) {
		this.status = status;
		this.meaning = meaning;
	}

	/**
	 * Getter method for property <tt>status</tt>.
	 *
	 * @return property value of status
	 */
	public int getStatus() {
		return status;
	}

	/**
	 * Setter method for property <tt>status</tt>.
	 *
	 * @param status
	 *            value to be assigned to property status
	 */
	public void setStatus(int status) {
		this.status = status;
	}

	/**
	 * Getter method for property <tt>meaning</tt>.
	 *
	 * @return property value of meaning
	 */
	public String getMeaning() {
		return meaning;
	}

	/**
	 * Setter method for property <tt>meaning</tt>.
	 *
	 * @param meaning
	 *            value to be assigned to property meaning
	 */
	public void setMeaning(String meaning) {
		this.meaning = meaning;
	}

	public static String getMeaningByStatus(int status) {
		for (BooKShopAuthStatusEnum tmp : BooKShopAuthStatusEnum.values()) {
			if (tmp.getStatus() == status) {
				return tmp.getMeaning();
			}
		}
		return "";
	}
}
