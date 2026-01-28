import AllServiceRequestsTable from '../components/AllServiceRequestsTable'
import serviceRequestsSlice from '../slices/serviceRequestsSlice.js'
import { useSelector } from 'react-redux'
import ServiceBookingStats from '../components/ServiceBookingStats'

export default function AllServiceRequests() {

	const { data, loading, totalCount, totalPages} = useSelector((state) => state.serviceRequests)
	const {data: statsData, loading: statsLoading} = useSelector((state) => state.serviceRequestsStats)

	return (
		<div className="p-5 py-0">
			<ServiceBookingStats data={statsData} loading={statsLoading} totalCount={totalCount} />
			<AllServiceRequestsTable data={data} loading={loading} totalPages={totalPages} />
		</div>
	)
}