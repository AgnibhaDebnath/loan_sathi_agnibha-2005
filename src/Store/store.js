import { create } from "zustand";
const useStore = create((set) => ({
    
        TotalLoanAmount: 0,
            TotalEMIAmount: 0,
                TotalActiveBorrowers: 0,
                    EMIPending: 0,
                        pendingCount:0,
                            approvedCount: 0,
                               rejectedCount: 0,
    setApplicationCount: (count) => set({
        pendingCount: count.pending,
        approvedCount: count.approved,
        rejectedCount:count.rejected
  })
    
}))
export default useStore;