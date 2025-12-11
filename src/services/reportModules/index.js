import {
  departmentList,
  dependentUserList,
  elementAccessLogs,
  elementActivityTransitionLogs,
  elementList,
  elementProcessOwnerAccessLogs,
  elementPublishLogs,
  moduleTypeList,
  roleList,
  testAttemptDetails,
  testAttemptLogs,
  testNameList,
  unitList,
  userAuthLogs,
  userList,
} from "./ReportsModule";

const getAuthLogReportUsersDropdownOption = async () => {
  try {
    const response = await userList();
    if (response?.status === 200) {
      const users = response?.data?.data;
      const options =
        users?.map((user) => ({
          value: user?.UserID,
          label: user?.UserName,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching user list");
    }
  } catch (error) {
    throw error;
  }
};

const getAuthLogs = async (body) => {
  try {
    const response = await userAuthLogs(body);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching user auth logs");
    }
  } catch (error) {
    throw error;
  }
};

const getModuleTypesDropdownOption = async () => {
  try {
    const response = await moduleTypeList();
    if (response?.status === 200) {
      const moduleTypes = response?.data?.data;
      const options =
        moduleTypes?.map((module) => ({
          value: module?.ModuleTypeID,
          label: module?.ModuleName,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching module types");
    }
  } catch (error) {
    throw error;
  }
};

const getElementsDropdownOption = async (body) => {
  try {
    const response = await elementList(body);
    if (response?.status === 200) {
      const elements = response?.data?.data;
      const options =
        elements?.map((element) => ({
          value: element?.ModuleID,
          label: element?.ElementName,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching elements");
    }
  } catch (error) {
    throw error;
  }
};

const getUnitsDropdownOption = async (body) => {
  try {
    const response = await unitList(body);
    console.log(response);
    if (response?.status === 200) {
      const units = response?.data?.data;
      const options =
        units?.map((unit) => ({
          value: unit?.UnitID,
          label: unit?.UnitName,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching units");
    }
  } catch (error) {
    throw error;
  }
};

const getDepartmentsDropdownOption = async (body) => {
  try {
    const response = await departmentList(body);
    console.log(response);
    if (response?.status === 200) {
      const departments = response?.data?.data;
      const options =
        departments?.map((department) => ({
          value: department?.DepartmentID,
          label: department?.DepartmentName,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching departments");
    }
  } catch (error) {
    throw error;
  }
};

const getRolesDropdownOption = async (body) => {
  try {
    const response = await roleList(body);
    console.log(response);
    if (response?.status === 200) {
      const roles = response?.data?.data;
      const options =
        roles?.map((role) => ({
          value: role?.RoleID,
          label: role?.RoleName,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching roles");
    }
  } catch (error) {
    throw error;
  }
};

const getUsersDropdownOption = async (body) => {
  try {
    const response = await dependentUserList(body);
    console.log(response);
    if (response?.status === 200) {
      const users = response?.data?.data;
      const options =
        users?.map((user) => ({
          value: user?.UserID,
          label: `${user?.UserFirstName} (${user?.UserLastName})`,
        })) || [];
      return options;
    } else {
      throw new Error("Error fetching users");
    }
  } catch (error) {
    throw error;
  }
};

const getElementPublishLogs = async (body) => {
  try {
    const response = await elementPublishLogs(body);
    console.log(response);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching element publish logs");
    }
  } catch (error) {
    throw error;
  }
};

const getElementAccessLogs = async (body) => {
  try {
    const response = await elementAccessLogs(body);
    console.log(response);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching element access logs");
    }
  } catch (error) {
    throw error;
  }
};

const getElementProcessOwnerAccessLogs = async (body) => {
  try {
    const response = await elementProcessOwnerAccessLogs(body);
    console.log(response);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching element access logs");
    }
  } catch (error) {
    throw error;
  }
};

const getElementActivityTransitionLogs = async (body) => {
  try {
    const response = await elementActivityTransitionLogs(body);
    console.log(response);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching element access logs");
    }
  } catch (error) {
    throw error;
  }
};

const getTestNameDropdownOption = async (body) => {
  try {
    const response = await testNameList(body);
    console.log(response);
    if (response?.status === 200) {
      const testNames = response?.data?.data;
      const mcqs = testNames?.mcq?.values;
      const test = testNames?.tes?.values;
      const mcqOptions =
        mcqs?.map((mcq) => ({
          value: mcq?.TestMCQID,
          label: mcq?.TestMCQName,
        })) || [];
      const testOptions =
        test?.map((test) => ({
          value: test?.TestSimulationID,
          label: test?.TestSimulationName,
        })) || [];
      return {
        mcq: mcqOptions,
        test: testOptions,
      };
    } else {
      throw new Error("Error fetching element access logs");
    }
  } catch (error) {
    throw error;
  }
};

const getTestAttemptLogs = async (body) => {
  try {
    const response = await testAttemptLogs(body);
    console.log(response);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching element access logs");
    }
  } catch (error) {
    throw error;
  }
};

const getTestAttemptDetails = async (body) => {
  try {
    const response = await testAttemptDetails(body);
    console.log(response);
    if (response?.status === 200) {
      const logs = response?.data?.data;
      return logs;
    } else {
      throw new Error("Error fetching element access logs");
    }
  } catch (error) {
    throw error;
  }
};

export default {
  getAuthLogReportUsersDropdownOption,
  getAuthLogs,
  getModuleTypesDropdownOption,
  getElementsDropdownOption,
  getElementPublishLogs,
  getElementAccessLogs,
  getUnitsDropdownOption,
  getDepartmentsDropdownOption,
  getRolesDropdownOption,
  getUsersDropdownOption,
  getElementProcessOwnerAccessLogs,
  getElementActivityTransitionLogs,
   getTestNameDropdownOption,
  getTestAttemptLogs,
  getTestAttemptDetails,
};
