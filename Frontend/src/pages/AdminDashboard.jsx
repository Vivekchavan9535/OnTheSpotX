import UsersTable from '../components/UsersTable'
import AdminDashboardStats from '../components/AdminDashboardStats';
import { useSelector } from 'react-redux'


export default function AdminDashboard() {
	
	const { data, loading, error } = useSelector((state) => state.serviceRequestsStats)
	const {totalRequests} = data;

	return (
		<div>
			<AdminDashboardStats totalRequests={totalRequests} />
			<UsersTable/>
		</div>
	)
}

