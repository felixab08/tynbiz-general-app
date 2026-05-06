 export interface MenuItem {
    id:       string;
    name:     string;
    icon:     string;
    route:    string;
    children?: MenuChildrenItem[];
  }

  export interface MenuChildrenItem {
    name:   string;
    route:  string;
  }
