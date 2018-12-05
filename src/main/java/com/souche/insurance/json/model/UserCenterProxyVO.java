package com.souche.insurance.json.model;

import java.io.Serializable;
import java.util.Date;

import com.wordnik.swagger.annotations.ApiModelProperty;

public class UserCenterProxyVO implements Serializable {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    /**
     * 真实姓名
     */
    @ApiModelProperty("真实姓名")
    private String            name;
    /**
     * 身份证号
     */
    @ApiModelProperty("身份证号")
    private String            certNo;
    /**
     * 家庭地址
     */
    @ApiModelProperty("家庭地址")
    private String            address;

    /**
     * 性别
     */
    @ApiModelProperty("性别")
    private String            sex;
    /**
     * 生日
     */
    @ApiModelProperty("生日")
    private Date              birthday;
    // /**
    // * 头像地址
    // */
    // @ApiModelProperty("真实姓名") private String avatar;
    /**
     * 省份
     */
    @ApiModelProperty("省份编码")
    private String            provinceCode;
    /**
     * 城市
     */
    @ApiModelProperty("城市编码")
    private String            cityCode;

    // member 部分
    @ApiModelProperty("ID")
    private String            id;

    @ApiModelProperty("iid")
    private Integer           iid;

    /**
     * 登录名
     */
    @ApiModelProperty("登录名")
    private String            userName;
    /***
     * 昵称
     */
    @ApiModelProperty("昵称")
    private String            nickname;
    /**
     * 电话
     */
    @ApiModelProperty("电话")
    private String            phone;

    /**
     * 手机绑定标识
     */
    @ApiModelProperty("手机绑定标识")
    private String            loginPhone;

    /**
     * email
     */
    @ApiModelProperty("email")
    private String            email;

    /**
     * 用户标记
     */
    @ApiModelProperty("用户标记")
    private String            userTag;

    /**
     * 创建者
     */
    @ApiModelProperty("创建者")
    private String            creator;

    /***
     * 购车等级
     */
    @ApiModelProperty("购车等级")
    private String            buyerLevel;

    /***
     * 登录类型
     */
    @ApiModelProperty("登录类型")
    private String            loginType;

    /**
     * 最后登录时间
     */
    @ApiModelProperty("最后登录时间")
    private Date              lastLoadDate;
    /**
     * 创建时间
     */
    @ApiModelProperty("创建时间")
    private Date              dateCreate;
    /**
     * 更新日期
     */
    @ApiModelProperty("更新日期")
    private Date              dateUpdate;

    /**
     * 用户头像
     */
    @ApiModelProperty("用户头像")
    private String            avatar;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCertNo() {
        return certNo;
    }

    public void setCertNo(String certNo) {
        this.certNo = certNo;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public Date getBirthday() {
        return birthday;
    }

    public void setBirthday(Date birthday) {
        this.birthday = birthday;
    }

    public String getProvinceCode() {
        return provinceCode;
    }

    public void setProvinceCode(String provinceCode) {
        this.provinceCode = provinceCode;
    }

    public String getCityCode() {
        return cityCode;
    }

    public void setCityCode(String cityCode) {
        this.cityCode = cityCode;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getIid() {
        return iid;
    }

    public void setIid(Integer iid) {
        this.iid = iid;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getLoginPhone() {
        return loginPhone;
    }

    public void setLoginPhone(String loginPhone) {
        this.loginPhone = loginPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserTag() {
        return userTag;
    }

    public void setUserTag(String userTag) {
        this.userTag = userTag;
    }

    public String getCreator() {
        return creator;
    }

    public void setCreator(String creator) {
        this.creator = creator;
    }

    public String getBuyerLevel() {
        return buyerLevel;
    }

    public void setBuyerLevel(String buyerLevel) {
        this.buyerLevel = buyerLevel;
    }

    public String getLoginType() {
        return loginType;
    }

    public void setLoginType(String loginType) {
        this.loginType = loginType;
    }

    public Date getLastLoadDate() {
        return lastLoadDate;
    }

    public void setLastLoadDate(Date lastLoadDate) {
        this.lastLoadDate = lastLoadDate;
    }

    public Date getDateCreate() {
        return dateCreate;
    }

    public void setDateCreate(Date dateCreate) {
        this.dateCreate = dateCreate;
    }

    public Date getDateUpdate() {
        return dateUpdate;
    }

    public void setDateUpdate(Date dateUpdate) {
        this.dateUpdate = dateUpdate;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

}
