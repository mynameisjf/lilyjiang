package com.jiangf.mapper;


import com.baomidou.dynamic.datasource.annotation.DS;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.jiangf.model.OracleUser;

/**
 * Created by JIANGF on 2018/12/14.
 */
@DS("slave_1")
public interface OracleUserMapper extends BaseMapper<OracleUser> {

}
