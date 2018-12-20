package com.jiangf.control;


import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jiangf.mapper.UserMapper;
import com.jiangf.model.User;
import com.jiangf.query.QueryConditionHandle;
import com.jiangf.util.EasyExcelUtil;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <p>
 *  前端控制器
 * </p>
 *
 * @author Beau 462620105@qq.com
 * @since 2018-12-03
 */
@Controller
@RequestMapping("user")
@PropertySource(value = "classpath:headermap.properties", ignoreResourceNotFound = true)
public class UserController {

    protected final Log logger = LogFactory.getLog(getClass());

    private final String USER_INDEX_PATH = "fw/orm/user";

    @Value("${export.excel.manage.user}")
    public String headerMap;

    @Autowired
    private UserMapper userMapper;

    /**
     * @页面跳转后台方法
     */
    @RequestMapping("/index.do")
    public String index(HttpServletRequest request, HttpSession session) {
        logger.info("跳转到用户管理主页面");
        String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";
        session.setAttribute("basePath", basePath);

        return this.USER_INDEX_PATH;
    }
    /**
     * 用户列表查询
     */
    @RequestMapping("/list.do")
    @ResponseBody
    public Map<String,Object> listAction(HttpServletRequest request ) {
        Map<String,Object> map=new HashMap<>();
        Page<User> page=new Page<>();
        Wrapper wrapper = new QueryWrapper<User>();

        QueryConditionHandle.parsecQueryParameterMapArray(request.getParameterMap(), wrapper, page);

        userMapper.selectPage(page, wrapper);
        map.put("total", page.getTotal());
        map.put("rows", page.getRecords());
        return map;
    }

    @RequestMapping("/export.do")
    public void exportAli(HttpServletResponse response,HttpServletRequest request)throws IOException {

        Wrapper wrapper = new QueryWrapper<User>();
        QueryConditionHandle.parsecQueryParameterMapArray(request.getParameterMap(), wrapper);

        List<Map<String,Object>> dataList1 = userMapper.selectMaps(wrapper);

        // 导出的表名
        String fileName = "导出数据" + new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        EasyExcelUtil.exportExcel(response, fileName,headerMap,dataList1);
    }


    @RequestMapping("save.do")
    public void save(
            HttpServletResponse response,
            @RequestParam(value = "formData",required = true) String formData,
            @RequestParam(value = "isNewData",required = true) Boolean isNewData
    ){

    }


    /**
     *
     * 通过用户的id集合批量逻辑删除用户，逻辑删除用户时一并清理所有和用户相关联的中间表关联记录，包括用户和角色，用户和资源，用户和模型的关联关系
     * @param response
     * @param ids
     */
    @RequestMapping("delete.do")
    public void delete(HttpServletResponse response, @RequestParam(value = "ids",required = false) String ids) throws Exception{

    }

    /**
     * 用户导入功能
     * @param response
     * @param imKey
     * @throws Exception
     */
    @RequestMapping("/import.do")
    public void importUserData(
            HttpServletResponse response,
            @RequestParam(value = "imKey",required = true) String imKey
    )throws Exception{

    }

}

