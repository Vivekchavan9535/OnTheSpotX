import UsersTable from '../components/UsersTable'
import AdminDashboardStats from '../components/AdminDashboardStats';

export default function AdminDashboard() {
	return (
		<div>
			<AdminDashboardStats />
			<UsersTable/>
		</div>
	)
}

