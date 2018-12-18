package com.jiangf.constant;

import java.util.HashMap;
import java.util.Map;

/**
 * @author Beau 462620105@qq.com
 * @date 2018-08-31
 * @email 462620105@qq.com
 *
 * @备注:框架常用常量类
 */
public class Constant {

/*========================================================================================================================================*/

    /**
     *
     *  逻辑删除标识
     *      0：未被逻辑删除
     *      1：已被逻辑删除

     */
    public final static Integer LOGIC_DELETE_VAL=1;
    public final static Integer LOGIC_NOT_DELETE_VAL=0;


/*========================================================================================================================================*/

    /**
     * 分页查询常用的常量

     * EXP_表达式符号
     *
     * ORDER_ 排序表达式符号
     * PARAM_ 封装的参数名字
     *
     * */
    public static final String EXP_EQ = "=";
    public static final String EXP_NOT_EQ = "<>";
    public static final String EXP_GT = ">";
    public static final String EXP_LT = "<";
    public static final String EXP_GE = ">=";
    public static final String EXP_LE = "<=";
    public static final String EXP_LIKE = "like";
    public static final String EXP_LEFT_LIKE = "leftLike";
    public static final String EXP_RIGHT_LIKE = "rightLike";
    public static final String EXP_IN = "in";
    public static final String EXP_NOT_IN = "notIn";
    public static final String EXP_IS_NULL = "isNull";
    public static final String EXP_IS_NOT_NULL = "isNotNull";

    public static final String ORDER_DEFAULT = "default";
    public static final String ORDER_CUSTOM = "custom";

    public static final String PARAM_ROWS = "rows";
    public static final String PARAM_PAGE = "page";
    public static final String PARAM_CONDITION = "condition";

    public static final String ASC = "ASC";
    public static final String DESC = "DESC";


 /*========================================================================================================================================*/

    /**
     * 资源默认图标
     */
    public static Map<String, String> ResourceIconClassMap = new HashMap<>();

    static {
        ResourceIconClassMap.put("000", "icon-sitemap");
        ResourceIconClassMap.put("100", "icon-gears");
        ResourceIconClassMap.put("200", "icon-home");
        ResourceIconClassMap.put("300", "icon-th-list");
        ResourceIconClassMap.put("400", "icon-th-list");
        ResourceIconClassMap.put("500", "icon-th-list");
        ResourceIconClassMap.put("600", "icon-th-list");
        ResourceIconClassMap.put("900", "icon-th-list");
    }

/*========================================================================================================================================*/


    public final static String SUPER_ROLE_ID="R00000001";//系统超级角色Id
    public final static String SUPER_ROLE_NAME="超级角色";

    public final static String SUPER_USER_ID="U00000001";//系统超级用户id
    public final static String SUPER_USER_ACCT="system";


    public final static String ROOT_RESOURCE_ID="RE00000001";//系统虚拟资源根节点Id（最顶端的资源根节点id值为RE00000001，不运行业务人员添加，修改，删除）;
    public final static String ROOT_PARENT_RESOURCE_ID="-1";//系统虚拟资源根节点的父节点Id(有id值，值为-1，但是在数据库中没有此id的数据)

    public final static String ROOT_ORG_ID="O00000000";//系统虚拟机构根节点Id（最顶端的机构根节点id值为O00000000，不允许业务人员添加，修改，删除）;
    public final static String ROOT_NORMAL_ORG_ID="O00000001";//系统虚拟标准机构根节点Id（最顶端的机构根节点id值为O00000000，不允许业务人员添加，修改，删除）;
    public final static String ROOT_PARENT_ORG_ID="-1";//系统虚拟机构根节点的父节点Id(有id值，值为-1，但是在数据库中没有此id的数据)

    public final static String ROOT_MODEL_ID="MO00000000";//系统虚拟机构根节点Id（机构生成的时候）
    public final static String ROOT_NORMAL_MODEL_ID="MO00000001";//系统虚拟机构根节点Id（标准机构生成的时候）
    public final static String ROOT_PARENT_MODEL_ID="-1";//系统虚拟国家标准机构根节点的父节点Id(有id值，值为-1，但是在数据库中没有此id的数据)
    public final static String ROOT_PARENT_MODEL_NAME="无";//系统虚拟国家标准机构根节点的父节点Name(有name值，值为'无')



    public final static String MODEL_TYPE_0="00";//机构
    public final static String MODEL_TYPE_1="01";//国家标准机构
    public final static String MODEL_TYPE_2="02";//部门
    public final static String MODEL_TYPE_3="03";//岗位
    public final static String MODEL_TYPE_4="04";//用户（人员）

    /**
     * 关联关系类型
     */
    public final static String USER_ROLE_TYPE="U-R";

    public final static String USER_USER_GROUP_TYPE="U-UG";

    public final static String USER_RESOURCE_TYPE="U-RE";

    public final static String ROLE_RESOURCE_TYPE="R-RE";

    public final static String USER_MODEL_TYPE="U-MO";

    public final static String ROLE_MODEL_TYPE="R-MO";




    public final static String PROTAL_FRAME_NAME="武汉数梦科技";
    public final static String PORTAL_FRAME_ICON_PATH="fw/portal/frame/img/portal-frame-icon.png";





/*========================================================================================================================================*/

}
