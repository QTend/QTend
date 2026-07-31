'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useToast } from "./ToastContext";
import { BranchProps } from "@/types/BranchType";


export interface TableData {
  _id: string | number;
  name: string;
  area?: string;
}

export interface ZoneData {
  _id: string;
  name: string;
  isActive: boolean;
}

interface ZoneProps {
    tables: TableData[];
    zones: ZoneData[];
}


export const ZoneContext = createContext<ZoneProps | null>(null);



export const ZoneProvider = ({children, branch}: {children: ReactNode, branch: BranchProps}) => {
    const {showToast} = useToast();
      const [tables, setTables] = useState<TableData[]>([]);
      const [zones, setZones] = useState<ZoneData[]>([]);
    

    useEffect(() => {
        const fetchData = async () => {
          try {
            // Fetch tables and zones concurrently so the page loads twice as fast!
            const [tablesRes, zonesRes] = await Promise.all([
              fetch(`/api/user-admin/${branch._id}/tables`),
              fetch(`/api/user-admin/${branch._id}/zones`)
            ]); 
    
            const tablesData = await tablesRes.json();
            const zonesData = await zonesRes.json();
    
            if (tablesData.success) setTables(tablesData.tables);
            if (zonesData.success) setZones(zonesData.zones);
            
          } catch (error) {
            console.error("Failed to fetch tables and zones", error);
          }
        }
        
        if (branch?._id) fetchData();
      }, [branch?._id]);


    return (
        <ZoneContext.Provider value={{
            tables,
            zones
        }}>
            {children}
        </ZoneContext.Provider>
    )
}




export const useZone = () => {
    const context = useContext(ZoneContext);
    if (!context) {
        throw new Error("useZone must be used inside ZoneProvider");
    }
    return context;
}