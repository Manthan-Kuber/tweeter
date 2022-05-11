import { Dispatch,SetStateAction } from "react";


export interface NavProps  {
    NavList: {
      id: number;
      name: string;
      url: string;
      icon: JSX.Element;
    }[];
    activeTab:string;
    setActiveTab:Dispatch<SetStateAction<string>>;
  };