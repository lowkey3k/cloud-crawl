<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户列表
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-form :model="query" :rules="rules" ref="ruleForm" :inline="true">

                    <el-form-item label="用户名" prop="f_like_username">
                        <!--keyup.enter.native回车-->
                        <el-input
                                v-model="query.f_like_username"
                                placeholder="请输入用户名"
                                clearable
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="getData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="姓名" prop="f_like_name">
                        <el-input
                                v-model="query.f_like_name"
                                placeholder="请输入姓名"
                                clearable
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="getData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="状态" prop="f_eq_status">
                        <el-select
                                v-model="query.f_eq_status"
                                placeholder="用户状态"
                                clearable
                                size="small"
                                style="width: 240px"
                        >
                            <el-option
                                    v-for="dict in statusOptions"
                                    :key="dict.code"
                                    :label="dict.name"
                                    :value="dict.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="性别" prop="f_eq_sex">
                        <el-select
                                v-model="query.f_eq_sex"
                                placeholder="性别"
                                clearable
                                size="small"
                                style="width: 240px"
                        >
                            <el-option
                                    v-for="dict in sexOptions"
                                    :key="dict.code"
                                    :label="dict.name"
                                    :value="dict.code"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="手机号" prop="f_like_phone">
                        <el-input
                                v-model="query.f_like_phone"
                                placeholder="请输入手机号"
                                clearable
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="getData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱" prop="f_like_email">
                        <el-input
                                v-model="query.f_like_email"
                                placeholder="请输入邮箱"
                                clearable
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="getData"
                        ></el-input>
                    </el-form-item>
                    <el-form-item label="身份证" prop="f_like_identify">
                        <el-input
                                v-model="query.f_like_identify"
                                placeholder="请输入身份证号"
                                clearable
                                size="small"
                                style="width: 240px"
                                @keyup.enter.native="getData"
                        ></el-input>
                    </el-form-item>


                    <el-form-item style="float: right">
                        <el-button
                                type="primary"
                                icon="el-icon-delete"
                                class="handle-del mr10"
                                @click="delAllSelection"
                        >批量删除
                        </el-button>
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button style="float: right" icon="el-icon-refresh" @click="resetForm('ruleForm')">重置
                        </el-button>
                    </el-form-item>
                    <el-form-item style="float: right">
                        <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索
                        </el-button>
                    </el-form-item>
                </el-form>

            </div>


            <el-table
                    :data="tableData"
                    border
                    class="table"
                    ref="multipleTable"
                    header-cell-class-name="table-header"
                    @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.avatar"
                                :preview-src-list="[scope.row.avatar]">
                        </el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>

                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="sexStr" label="性别" :formatter="sexFormat"></el-table-column>

                <el-table-column prop="identify" label="身份证"></el-table-column>

                <el-table-column prop="phone" label="手机号"></el-table-column>
                <el-table-column prop="email" label="邮箱"></el-table-column>

                <el-table-column prop="roles" label="角色" :formatter="roleFormat"></el-table-column>


                <!--<el-table-column  label="状态" :formatter="statusFormat">-->
                <!--<el-switch-->
                <!--v-model="status"-->
                <!--active-color="#13ce66"-->
                <!--inactive-color="#ff4949">-->
                <!--</el-switch>-->

                <!--</el-table-column>-->

                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-switch
                                v-model="scope.row.status"
                                :active-value="1"
                                :inactive-value="0"
                                @change="handleStatusChange(scope.row)"
                        ></el-switch>
                    </template>
                </el-table-column>


                <!--<el-table-column prop="date" label="注册时间"></el-table-column>-->
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                                type="text"
                                icon="el-icon-edit"
                                @click="handleEdit(scope.$index, scope.row)"
                        >编辑
                        </el-button>
                        <el-button
                                type="text"
                                icon="el-icon-delete"
                                class="red"
                                @click="handleDelete(scope.$index, scope.row)"
                        >删除
                        </el-button>
                        <image src="../../assets/logo.png"></image>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                        background
                        layout="total, prev, pager, next"
                        :current-page="query.pageNo"
                        :page-size="query.pageSize"
                        :total="pageTotal"
                        @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="editForm" :rules="editRules" :model="form" label-width="70px">
                <el-form-item prop="name" label="姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="年龄">
                    <el-input v-model="form.age"></el-input>
                </el-form-item>
                <!--<el-form-item label="性别">-->
                <!--<el-input v-model="form.sex"></el-input>-->
                <!--</el-form-item>-->

                <el-form-item label="性别">
                    <el-radio-group v-model="form.sex">
                        <el-radio :label="1">男</el-radio>
                        <el-radio :label="0">女</el-radio>
                    </el-radio-group>
                </el-form-item>


                <el-form-item prop="phone" label="手机号">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item prop="email" label="邮箱">
                    <el-input v-model="form.email"></el-input>
                </el-form-item>
                <el-form-item prop="identify" label="身份证">
                    <el-input v-model="form.identify"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {edit, fetchData, deleteUser, deleteByIds} from '../../api/user';
    import {findTreeByPid} from '../../api/datadict';

    import service from '../../utils/request';
    import ElFormItem from "../../../node_modules/element-ui/packages/form/src/form-item.vue";

    export default {
        components: {ElFormItem},
        name: 'basetable',
        data() {
            let checkName = (rule, value, callback) => {
                service.get('user/checkUnique?name=username&value=' + this.param.username).then(function (result) {
                    if (result.result) {
                        return callback(new Error('用户名已存在'));
                    } else {
                        callback();
                    }
                });
            };
            let checkPhone = (rule, value, callback) => {
                service.get('user/checkUnique?name=phone&value=' + this.param.phone).then(function (result) {
                    if (result.result) {
                        return callback(new Error('手机号已注册'));
                    } else {
                        callback();
                    }
                });
            };
            return {
                query: {
                    pageNo: 1,
                    pageSize: 10,
                    f_like_username: '',
                    f_like_identify: '',
                    f_like_email: '',
                    f_eq_sex: '',
                    f_eq_status: undefined,
                    f_like_phone: ''
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                editVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                rules: {},
                statusOptions: [],
                sexOptions: [],
                editRules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    username: [{
                        required: true,
                        message: '请输入用户名',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        message: '用户名不能少于6位'
                    },
                        {
                            validator: checkName,
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'blur'
                    }, {
                        min: 6,
                        max: 18,
                        message: '密码在6-21位之间，并且包含英文字母加数字'
                    }, {
                        pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$/,
                        message: '密码必须包含数字和字母两种，且必须为6到18位'
                    }
                    ],
                    email: [{
                        required: true,
                        type: 'email',
                        message: '请输入正确的邮箱',
                        trigger: 'blur'
                    }],
                    phone: [{
                        required: true,
                        message: '请输入正确手机号',
                        trigger: 'blur'
                    }, {
                        pattern: /^1[3-9]\d{9}$/,
                        message: '手机号格式错误'
                    },
                        {
                            validator: checkPhone,
                            trigger: 'blur'
                        }],
                    identify: [{
                        required: true,
                        message: '请输入身份证号',
                        trigger: 'blur'
                    }, {
                        min: 15,
                        max: 15,
                        message: '请输入正确身份证'
                    }]
                }
            };
        },
        created() {
            this.getData();
            this.getStatusDataDict();
            this.getSexDataDict();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                fetchData(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.result.records;
                    this.pageTotal = res.result.total || 0;
                });
            },
            getStatusDataDict() {
                let param = {f_eq_pid: "1003"};
                let vm = this;
                findTreeByPid(param).then(function (res) {
                    if (res.code === '0') {
                        vm.statusOptions = res.result;
                    }
                })
            },
            getSexDataDict() {
                let param = {f_eq_pid: "1001"};
                let vm = this;
                findTreeByPid(param).then(function (res) {
                    if (res.code === '0') {
                        vm.sexOptions = res.result;
                    }
                })
            },
            sexFormat(row, column) {
                if (row.sex === 1) {
                    return '男';
                } else if (row.sex === 0) {
                    return '女';
                }
                if (row.sex === '男') {
                    return '男';
                } else {
                    return '女';
                }
            },
            /** 重置按钮操作 */

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            statusFormat(row, column) {
                if (row.status === 1) {
                    return '有效';
                } else {
                    return '无效';
                }
            },
            // 角色状态修改
            handleStatusChange(row) {
                let text = row.status === 1 ? '启用' : '停用';
                this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function () {
                    let data = {
                        id: row.id,
                        status: row.status
                    };
                    return edit(data);
                }).then(() => {
                    this.$message.success(text + '成功');
                }).catch(function () {

                    row.status = row.status === 0 ? 1 : 0;
                });

            },
            roleFormat(row, column) {
                return row.roles.map(function (obj, index) {
                    return obj.name;
                }).join(',');
            },
            // 触发搜索按钮
            handleSearch() {
                // this.$set(this.query,"pageNo",1);
                this.$set(this.query);
                this.getData();
            },
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let vm = this;
                        let param = {'id': row.id};
                        deleteUser(param).then(function (result) {
                            if (result.code === '0') {
                                vm.$message.success('删除成功');
                                vm.tableData.splice(index, 1);
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            // 多选操作
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            delAllSelection() {
                const length = this.multipleSelection.length;
                let str = '';
                this.delList = this.delList.concat(this.multipleSelection);
                if (this.delList.length == 0) {
                    this.$message.warning("请勾选要删除的人员");
                    return;
                }
                let ids = this.delList.map(function (obj, index) {
                    return obj.id;
                });
                for (let i = 0; i < length; i++) {
                    str += this.multipleSelection[i].name + ' ';
                }
                let vm = this;
                deleteByIds(ids).then(function (res) {
                    if (res.code === '0') {
                        vm.$message.error(`删除了${str}`);
                    }
                });
                this.multipleSelection = [];
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.editVisible = true;
            },
            // 保存编辑
            saveEdit() {
                this.editVisible = false;
                this.$set(this.tableData, this.idx, this.form);
                this.form.sex = this.form.sex === '男' ? 1 : 0;
                let vm = this;
                vm.$refs.editForm.validate(valid => {
                    if (valid) {
                        edit(this.form).then(function (result) {
                            if (result.code === '0') {
                                vm.$message.success(`修改成功`);
                            }
                        });
                    }
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            }
        }
    };
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }

    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 200px;
        display: inline-block;
    }

    .table {
        width: 100%;
        font-size: 14px;
    }

    .red {
        color: #ff0000;
    }

    .mr10 {
        margin-right: 10px;
    }

    .table-td-thumb {
        display: block;
        margin: auto;
        width: 40px;
        height: 40px;
    }
</style>
