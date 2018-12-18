package com.jiangf.control;


import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.metadata.Sheet;
import com.baomidou.mybatisplus.core.conditions.Wrapper;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.jiangf.mapper.UserMapper;
import com.jiangf.model.User;
import com.jiangf.query.QueryConditionHandle;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.poi.ss.usermodel.DateUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.*;

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
public class UserController {

    protected final Log logger = LogFactory.getLog(getClass());

    private final String USER_INDEX_PATH = "fw/orm/user";


    @Autowired
    private UserMapper userMapper;

    /**
     * @页面跳转后台方法
     */
    @RequestMapping("/index.do")
    public String index(HttpServletRequest request, HttpSession session) {
        logger.info("跳转到用户管理主页面");

        String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ request.getContextPath() + "/";
        logger.info(basePath);
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
        map.put("total",page.getTotal());
        map.put("rows", page.getRecords());
        return map;
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

    @RequestMapping("/export.do")
    public void exportAli(HttpServletResponse response)throws IOException {
        ServletOutputStream out = response.getOutputStream();

        // 获得EXCEL下载方法类
        ExcelWriter writer = EasyExcelFactory.getWriter(out);

        // EXCEL名字
        String fileName = new String(("UserInfo " + new SimpleDateFormat("yyyy-MM-dd").format(new Date()))
                .getBytes(), "UTF-8");
        //
        Sheet sheet1 = new Sheet(1, 0);
        // 设置自适应宽度
        sheet1.setAutoWidth(Boolean.TRUE);


        sheet1.setHead(createTestListStringHead());
        writer.write1(createTestListObject(), sheet1);

        writer.finish();
        response.setContentType("multipart/form-data");
        response.setCharacterEncoding("utf-8");
        response.setHeader("Content-disposition", "attachment;filename=" + fileName + ".xlsx");
        response.setHeader("Content-Type", "application/vnd.ms-excel");

        out.flush();
    }
    public static List<List<Object>> createTestListObject() {
        List<List<Object>> object = new ArrayList<List<Object>>();
        for (int i = 0; i < 1000; i++) {
            List<Object> da = new ArrayList<Object>();
            da.add("字符串"+i);
            da.add(Long.valueOf(187837834l+i));
            da.add(Integer.valueOf(2233+i));
            da.add(Double.valueOf(2233.00+i));
            da.add(Float.valueOf(2233.0f+i));
            da.add(new Date());
            da.add(new BigDecimal("3434343433554545"+i));
            da.add(Short.valueOf((short)i));
            object.add(da);
        }
        return object;
    }

    public static List<List<String>> createTestListStringHead(){
        //写sheet3  模型上没有注解，表头数据动态传入
        List<List<String>> head = new ArrayList<List<String>>();
        List<String> headCoulumn1 = new ArrayList<String>();
        List<String> headCoulumn2 = new ArrayList<String>();
        List<String> headCoulumn3 = new ArrayList<String>();
        List<String> headCoulumn4 = new ArrayList<String>();
        List<String> headCoulumn5 = new ArrayList<String>();

        headCoulumn1.add("第一列");headCoulumn1.add("第一列");headCoulumn1.add("第一列");
        headCoulumn2.add("第一列");headCoulumn2.add("第一列");headCoulumn2.add("第一列");

        headCoulumn3.add("第二列");headCoulumn3.add("第二列");headCoulumn3.add("第二列");
        headCoulumn4.add("第三列");headCoulumn4.add("第三列2");headCoulumn4.add("第三列2");
        headCoulumn5.add("第一列");headCoulumn5.add("第3列");headCoulumn5.add("第4列");

        head.add(headCoulumn1);
        head.add(headCoulumn2);
        head.add(headCoulumn3);
        head.add(headCoulumn4);
        head.add(headCoulumn5);
        return head;
    }

}

