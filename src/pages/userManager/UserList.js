import React, { useEffect, useState } from "react";
import { Table, Switch, Button, Modal, Form } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import axios from "axios";
import UserForm from "../../components/user-manage/UserForm";

export const UserList = () => {
  const [useListData, setUserListData] = useState([]);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateVisible] = useState(false);
  const [regionData, setRegionData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [regionIsDisable, setRegionIsDisable] = useState(false);
  const [isShowEditTitle, setIsShowEditTitle] = useState(false);
  const { confirm } = Modal;
  const [form] = Form.useForm();

  const getUserListdata = () => {
    axios.get("http://localhost:3000/users?_expand=role").then((res) => {
      const { data } = res || {};
      setUserListData(data);
    });
  };

  useEffect(() => {
    getUserListdata();
    axios.get("http://localhost:3000/regions").then((res) => {
      const { data } = res || {};
      setRegionData(data);
    });
    axios.get("http://localhost:3000/roles").then((res) => {
      const { data } = res || {};
      data.length > 0 && setRoleList(data);
    });
  }, []);

  const deletefunction = (item) => {
    setUserListData(useListData.filter((data) => data.id !== item.id));
    axios.delete(`http://localhost:3000/users/${item.id}`);
  };

  const columns = [
    {
      title: "区域",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "角色名称",
      dataIndex: "role",
      render: (role) => {
        return role.roleName;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "用户状态",
      render: (item) => {
        return (
          <Switch
            checked={item.roleState}
            disabled={item?.default}
            onChange={() => {
              item.roleState = !item.roleState;
              setUserListData([...useListData]);
              axios.patch(`http://localhost:3000/users/${item.id}`, {
                roleState: item.roleState,
              });
            }}
          ></Switch>
        );
      },
    },
    {
      title: "操作",
      render: (item) => {
        return (
          <div>
            <Button
              danger={true}
              style={{ marginRight: "4px" }}
              icon={<DeleteOutlined />}
              shape="circle"
              disabled={item?.id === 1 ? true : false}
              onClick={() => {
                confirm({
                  title: "你确认删除数据吗",
                  onOk() {
                    deletefunction(item);
                  },
                  onCancer() {},
                });
              }}
            ></Button>
            <Button
              type="primary"
              shape="circle"
              disabled={item?.id === 1 ? true : false}
              icon={<EditOutlined />}
              onClick={() => {
                setIsShowEditTitle(true);
                setIsAddModalVisible(true);
                console.log("item", item);
                form.setFieldsValue({
                  ...item,
                });
              }}
            ></Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Button
        type="primary"
        style={{ marginTop: "2px", marginBottom: "2px" }}
        onClick={() => {
          form.resetFields();
          setIsAddModalVisible(true);
          setIsShowEditTitle(false);
        }}
      >
        添加用户
      </Button>
      <Table
        dataSource={useListData}
        columns={columns}
        rowKey={(item) => item.id}
        pagination={{ pageSize: 7 }}
      />
      <Modal
        open={isAddModalVisible}
        title={isShowEditTitle ? "更新用户" : "添加用户"}
        okText="确定"
        cancelText="取消"
        onOk={() => {
          form
            .validateFields()
            .then((value) => {
              console.log("--value--", value);
              axios
                .post("http://localhost:3000/users?_expand=role?", {
                  ...value,
                  roleState: true,
                  default: false,
                })
                .then((res) => {
                  getUserListdata();
                  setIsAddModalVisible(false);
                });
            })
            .catch((err) => {
              console.log("--err--", err);
            });
        }}
        onCancel={() => {
          setIsAddModalVisible(false);
        }}
      >
        <UserForm
          regionIsDisable={regionIsDisable}
          regionData={regionData}
          setRegionIsDisable={setRegionIsDisable}
          roleList={roleList}
          form={form}
        />
      </Modal>
      <Modal
        open={isUpdateModalVisible}
        okText="确定"
        cancelText="取消"
        onOk={(item) => {
          console.log("item", item);
        }}
        onCancel={() => {
          setIsUpdateVisible(false);
        }}
      >
        <UserForm
          regionIsDisable={regionIsDisable}
          regionData={regionData}
          setRegionIsDisable={setRegionIsDisable}
          roleList={roleList}
          form={form}
        />
      </Modal>
    </>
  );
};
