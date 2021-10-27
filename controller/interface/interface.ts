export interface LoginInterface {
  page_title: string;
  paths: {
    register_path: string,
    self_path: string,
  };
}

export interface RegisterInterface {
  page_title: string;
  paths: {
    login_path: string,
    self_path: string,
  };
}

export interface Dashboard {
  page_title: string;
}
