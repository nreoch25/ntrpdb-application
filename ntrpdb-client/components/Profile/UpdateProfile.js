// import { useState, useContext } from "react";
import { Form, Input, Button, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useUpdateUserMutation } from "../../hooks/useUpdateMutation";
// import { useImageUploadMutation } from "../../hooks/useImageUpload";

const { Item } = Form;
const { Option } = Select;

const UpdateProfile = ({ user, setEditMode }) => {
  console.log({ user });
  const { updateUser, loading: mutationLoading } = useUpdateUserMutation({ setEditMode });
  // const { imageUpload } = useImageUploadMutation();
  const [form] = Form.useForm();

  const dummyRequest = (options) => {
    const { onSuccess } = options;
    setTimeout(() => {
      onSuccess("ok");
    }, 0);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const onFinish = async (values) => {
    const { profilePicture, profileVideo, name, ntrp } = values;

    const updateVariables = {
      input: {
        id: user.id,
        name,
        ntrp,
        ...(profilePicture &&
          profilePicture[0] && { profilePicture: profilePicture[0].originFileObj }),
        ...(profileVideo && profileVideo[0] && { profileVideo: profileVideo[0].originFileObj }),
      },
    };

    console.log({ updateVariables });

    updateUser({ variables: updateVariables });
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <Form
      name="profile"
      initialValues={{ remember: true, ["name"]: user.name, ["ntrp"]: user.ntrp }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
      form={form}
    >
      <Item
        label="Name"
        name="name"
        rules={[
          {
            required: false,
            message: "Please input your first and last name",
          },
        ]}
      >
        <Input />
      </Item>

      <Item
        name="ntrp"
        label="NTRP Rating"
        rules={[
          {
            required: false,
            message: "Please select your NTRP Rating",
          },
        ]}
      >
        <Select placeholder="Please select your NTRP Rating">
          <Option value="2.0">2.0</Option>
          <Option value="2.5">2.5</Option>
          <Option value="3.0">3.0</Option>
          <Option value="3.5">3.5</Option>
          <Option value="4.0">4.0</Option>
          <Option value="4.5">4.5</Option>
          <Option value="5.0">5.0</Option>
          <Option value="5.5">5.5</Option>
          <Option value="6.0">6.0</Option>
          <Option value="6.5">6.5</Option>
          <Option value="7.0">7.0</Option>
        </Select>
      </Item>

      <Item
        name="profilePicture"
        label="Profile Picture"
        valuePropName="profilePicture"
        getValueFromEvent={normFile}
        className="align-left"
      >
        <Upload name="profilePicture" customRequest={dummyRequest} maxCount="1">
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Item>

      <Item
        name="profileVideo"
        label="Profile Video"
        valuePropName="profileVideo"
        getValueFromEvent={normFile}
        className="align-left"
      >
        <Upload name="profileVideo" listType="picture" maxCount="1">
          <Button icon={<UploadOutlined />}>Click to upload your Profile Video</Button>
        </Upload>
      </Item>

      <Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!user.id}
          loading={mutationLoading}
        >
          Submit
        </Button>
        <Button block onClick={() => setEditMode(false)} style={{ marginTop: "1rem" }}>
          Cancel
        </Button>
      </Item>
    </Form>
  );
};

export { UpdateProfile };
