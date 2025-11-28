import AllServiceRequestsTable from '../components/AllServiceRequestsTable'
import serviceRequestsSlice from '../slices/serviceRequestsSlice.js'
import { useSelector } from 'react-redux'
import ServiceBookingStats from '../components/ServiceBookingStats'

export default function AllServiceRequests() {

	const { data, loading } = useSelector((state) => state.serviceRequests)

	return (
		<div className="p-5 py-0">
			<ServiceBookingStats/>
			<AllServiceRequestsTable data={data} loading={loading} />
		</div>
	)
}