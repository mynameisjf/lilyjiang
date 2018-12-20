package com.jiangf.service;

import java.util.List;

/**
 * Created by JIANGF on 2018/12/20.
 */
public interface DataSourceService {
    void init();

    List selectSpelByKey(String tenantName) ;
}
