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
                <el-button
                        type="primary"
                        icon="el-icon-plus"
                        class="handle-del mr10"
                        @click="handleAdd"
                >添加角色
                </el-button>
                <el-input v-model="query.f_like_name" placeholder="角色名称" class="handle-input mr10"></el-input>
                <el-input v-model="query.f_like_sign" placeholder="角色标识" class="handle-input mr10"></el-input>
                <el-button style="float: right" type="primary" icon="el-icon-search" @click="handleSearch">搜索
                </el-button>
            </div>


            <el-table
                    :data="tableData"
                    border
                    ref="multipleTable"
                    header-cell-class-name="table-header">

                <!--class="table"-->
                <!--@selection-change="handleSelectionChange"-->

                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="角色名称"></el-table-column>
                <el-table-column prop="sign" label="角色标识"></el-table-column>
                <el-table-column prop="description" label="角色描述"></el-table-column>
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
                <el-table-column label="操作" width="200" align="center">
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
        <el-dialog title="绑定资源" :visible.sync="bindPermissionVisible" width="45%" center>
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
    <el-button @click="bindPermissionVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRole">确 定</el-button>
              </span>
            </template>
        </el-dialog>

        <!--添加角色-->
        <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="35%" center>
            <el-form ref="addForm" :rules="rules" :model="form" label-width="80px">
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="sign" label="标识">
                    <el-input v-model="form.sign"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRole">确 定</el-button>
            </span>
        </el-dialog>

        <!--编辑角色-->
        <el-dialog title="编辑角色" :visible.sync="editRoleVisible" width="35%" center>
            <el-form ref="editForm" :rules="editRules" :model="form" label-width="80px">
                <el-form-item prop="name" label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="sign" label="标识">
                    <el-input v-model="form.sign"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>


                <el-form-item label="绑定资源">
                    <el-tree
                            :data="treePermission"
                            show-checkbox
                            accordion
                            node-key="id"
                            ref="tree"
                            :default-checked-keys="permissionCheckedKeys"
                            highlight-current
                            :props="defaultProps">
                    </el-tree>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRoleVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>

                <div class="buttons">

</div>
            </span>
        </el-dialog>

    </div>
</template>

<script>
    import { getRolePage, editRole, addRole, editCheckUnique, deleteRole } from '../../api/role';
    import { getPermissionByRoleId,roleAddPermission, getPermissionTree } from '../../api/permission';

    import { edit, fetchData } from '../../api/user';
    import service from '../../utils/request';

    export default {

        name: 'basetable',
        data() {
            let checkSign = (rule, value, callback) => {
                service.get('role/checkUnique?name=sign&value=' + this.form.sign).then(function(result) {
                    if (result.result) {
                        return callback(new Error('角色已存在'));
                    } else {
                        callback();
                    }
                });
            };
            let editCheckSign = (rule, value, callback) => {
                let param = {
                    id: this.form.id,
                    name: 'sign',
                    value: this.form.sign
                };
                editCheckUnique(param).then(function(result) {
                    if (result.result) {
                        return callback(new Error('角色已存在'));
                    } else {
                        alert("callback");
                        callback();
                    }
                });
            };
            return {
                query: {
                    // address: '',
                    name: '',
                    pageNo: 1,
                    pageSize: 10,
                    f_like_username: '',
                    f_like_identify: '',
                    f_like_email: '',
                    f_eq_sex: '',
                    f_like_phone: ''
                },
                tableData: [],
                multipleSelection: [],
                delList: [],
                bindPermissionVisible: false,
                addRoleVisible: false,
                editRoleVisible: false,
                pageTotal: 0,
                form: {
                    sign: undefined,
                    name: undefined
                },
                permissionCheckedKeys: [],
                idx: -1,
                id: -1,
                value: [],
                data: [],
                treePermission: [],
                rules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                    sign: [{ required: true, message: '请输入角色标识', trigger: 'blur' },
                        {
                            validator: checkSign,
                            trigger: 'blur'
                        }]
                },
                editRules: {//rules验证通过后this.$refs.login.validate中valid参数返回true
                    name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
                    sign: [{ required: true, message: '请输入角色标识', trigger: 'blur' },
                        {
                            validator: editCheckSign,
                            trigger: 'blur'
                        }]
                },
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    id: 'id'
                }
            };
        },
        created() {
            this.getData();
        },
        methods: {
            // 获取 easy-mock 的模拟数据
            getData() {
                getRolePage(this.query).then(res => {
                    console.log(res);
                    this.tableData = res.result.records;
                    this.pageTotal = res.result.total || 50;
                });
            },
            getCheckedKeys() {
                return this.$refs.tree.getCheckedKeys();
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
            // 角色状态修改
            handleStatusChange(row) {
                let text = row.status === 1 ? '启用' : '停用';
                this.$confirm('确认要"' + text + '""' + row.name + '"角色吗?', '警告', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(function() {
                    let data = {
                        id: row.id,
                        status: row.status
                    };
                    return editRole(data);
                }).then(() => {
                    this.$message.success(text + '成功');
                }).catch(function() {
                    row.status = row.status === 0 ? 1 : 0;
                });

            },
            // 触发搜索按钮
            handleSearch() {
                // this.$set(this.query,"pageNo",1);
                this.$set(this.query);
                this.getData();
            }
            ,
            // 删除操作
            handleDelete(index, row) {
                // 二次确认删除
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                })
                    .then(() => {
                        let vm = this;
                        let param = { 'id': row.id };
                        deleteRole(param).then(function(result) {
                            if (result.code === '0') {
                                vm.$message.success('删除成功');
                                vm.tableData.splice(index, 1);
                                vm.getData();
                            }
                        });
                    })
                    .catch(() => {
                    });
            },
            // 编辑操作
            handleEdit(index, row) {
                this.idx = index;
                this.form = row;
                this.id=row.id;
                this.editRoleVisible = true;
                let vm = this;
                getPermissionTree(undefined).then(function(res) {
                    if (res.code === '0') {
                        vm.treePermission = res.result;
                        //选中已经拥有的权限
                        vm.getPermissionByRole(row.id);
                    }
                });
            },
            //根据roleId获取已经选中的权限
            getPermissionByRole(roleId) {
                let vm = this;
                getPermissionByRoleId(roleId).then(function(res) {
                    if (res.code === '0') {
                        res.result.forEach((obj, index) => {
                            vm.permissionCheckedKeys.push(obj.id);
                        });
                    }
                });
            },
            // 编辑操作
            editRole(index, row) {
                this.$refs.editForm.validate(validate => {
                    if (validate) {
                        this.$set(this.tableData, this.idx, this.form);
                        let vm = this;
                        let data=[];
                        console.log(this.getCheckedKeys());
                        this.getCheckedKeys().forEach((permissionId, index) => {
                            if (permissionId != null && this.id != null) {
                                data.push({
                                    permissionId: permissionId,
                                    roleId: vm.id
                                });
                            }
                        });

                        roleAddPermission(data).then(function(res) {
                            if (res.code!=='0'){
                                vm.$message.error("绑定资源操作失败");
                            }
                        });

                        editRole(this.form).then(function(result) {
                            if (result.code === '0') {
                                vm.$message.success(`修改成功`);
                                vm.editRoleVisible = false;
                                vm.getData();
                            }
                        });
                    } else
                        return false;
                });


            },
            handleAdd() {
                this.addRoleVisible = true;
                //每次都初始化为空
                this.form = {};
            },
            // 保存
            addRole() {
                this.$refs.addForm.validate(validate => {
                    if (validate) {
                        let vm = this;
                        addRole(this.form).then(function(res) {
                            if (res.code === '0') {
                                vm.$message.success('添加成功');
                                vm.addRoleVisible = false;
                                vm.getData();
                            }
                        });
                    } else
                        return false;
                });
            },
            // 分页导航
            handlePageChange(val) {
                this.$set(this.query, 'pageNo', val);
                this.getData();
            },
            bindPermission(index, row) {


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
