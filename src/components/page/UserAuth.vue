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
                    ref="multipleTable"
                    header-cell-class-name="table-header">

                <!--class="table"-->
                <!--@selection-change="handleSelectionChange"-->

                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="roles" label="角色" :formatter="roleFormat"></el-table-column>

                <el-table-column label="头像(查看大图)" align="center">
                    <template slot-scope="scope">
                        <el-image
                                class="table-td-thumb"
                                :src="scope.row.avatar"
                                :preview-src-list="[scope.row.avatar]">
                        </el-image>
                    </template>
                </el-table-column>

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
                                icon="el-icon-circle-plus-outline"
                                @click="handleEdit(scope.$index, scope.row)"
                        >绑定角色
                        </el-button>
                        <!--<el-button-->
                        <!--type="text"-->
                        <!--icon="el-icon-delete"-->
                        <!--class="red"-->
                        <!--@click="handleDelete(scope.$index, scope.row)"-->
                        <!--&gt;删除-->
                        <!--</el-button>-->
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

        <el-dialog title="绑定角色" :visible.sync="bindRoleVisible" width="45%" center>
            <template>
                <el-transfer
                        filterable
                        :filter-method="filterMethod"
                        filter-placeholder="请输入角色名称"
                        v-model="value"
                        :titles="['角色', '拥有角色']"
                        :data="data">
                </el-transfer>
                <span slot="footer" class="dialog-footer">
    <el-button @click="bindRoleVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
  </span>
            </template>
        </el-dialog>

    </div>
</template>

<script>
    import { getRoleList, userAddRole } from '../../api/role';
    import { edit, fetchData } from '../../api/user';
    import {findTreeByPid} from '../../api/datadict';

    export default {

        name: 'basetable',
        data() {
            return {
                query: {
                    pageNo: 1,
                    pageSize: 10,
                    f_like_username: '',
                    f_like_name: undefined,
                    f_eq_status: undefined
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                bindRoleVisible: false,
                pageTotal: 0,
                form: {},
                idx: -1,
                id: -1,
                value: [],
                data: [],
                rules: {},
                statusOptions: []
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
            statusFormat(row, column) {
                if (row.status === 1) {
                    return '有效';
                } else {
                    return '无效';
                }
            },
            filterMethod(query, item) {
                return item.nameSearch.indexOf(query) > -1;
            },
            /** 重置按钮操作 */

            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            // 角色状态修改
            handleStatusChange(row) {
                let text = row.status === 1 ? '启用' : '停用';
                this.$confirm('确认要"' + text + '""' + row.name + '"用户吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    let data = {
                        id: row.id,
                        status: row.status
                    };
                    return edit(data);
                }).then(() => {
                    this.$message.success(text + '成功');
                }).catch(function() {

                    row.status = row.status === 0 ? 1 : 0;
                });

            },
            roleFormat(row, column) {
                return row.roles.map(function(obj, index) {
                    return obj.name;
                }).join(',');
            },
            // 触发搜索按钮
            handleSearch() {
                // this.$set(this.query,"pageNo",1);
                this.$set(this.query);
                this.getData();
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.id = row.id;
                // this.form = row;
                this.bindRoleVisible = true;
                let param = { f_eq_status: 1 };

                let vm = this;
                //每次都初始化为空
                this.data = [];
                getRoleList(param).then(function(result) {
                    if (result.code === '0') {
                        let roles = result.result;
                        roles.forEach((role, index) => {
                            vm.data.push({
                                label: role.name,
                                key: role.id,
                                nameSearch: roles[index].name
                            });
                        });
                    }
                });
                this.value = [];
                row.roles.forEach((role, index) => {
                    this.value.push(role.id);
                });

            },
            // 保存编辑
            addRole() {
                let vm = this;
                let data = [];
                this.value.forEach((roleId, index) => {
                    if (roleId != null && this.id != null) {
                        data.push({
                            userId: this.id,
                            roleId: roleId
                        });
                    }
                });
                userAddRole(data).then(function(result) {
                    if (result.code === '0') {
                        vm.$message.success(`修改成功`);
                        vm.bindRoleVisible = false;
                        vm.getData();

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
