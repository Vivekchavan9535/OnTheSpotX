import React, { useEffect } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Trash } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  fetchSingleUser,
  fetchUsers,
} from "../slices/usersSlice";
import { ConfirmDialog } from "../components/ui/components/ui/ConfirmDialog.jsx";
import { Input } from "@/components/ui/input";

export default function UsersTable() {
  const { data } = useSelector((state) => state.users);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUsers(""));
  }, [dispatch]);

  const handleDelete = (id) => dispatch(deleteUser(id));
  const handleShow = (id) => {
    dispatch(fetchSingleUser(id));
    navigate(`/user/${id}`);
  };

  return (
    <div className="p-5 sm:p-8">

      {/* Search Bar */}
      <div className="max-w-sm mb-4">
        <Input
          placeholder="Search users..."
          onChange={(e) => dispatch(fetchUsers(e.target.value))}
        />
      </div>

      {/* ---------------- MOBILE VIEW ---------------- */}
      <div className="md:hidden space-y-4">
        {data.map((user) => (
          <div
            key={user._id}
            className="p-4 bg-white rounded-lg shadow border flex items-start gap-4"
          >
            <Avatar>
              <AvatarFallback>
                {user.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-semibold">{user.fullName}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>

              <div className="flex gap-2 mt-2">
                <Badge
                  className={
                    user.role === "admin"
                      ? "bg-yellow-100 text-yellow-800"
                      : user.role === "mechanic"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-green-100 text-green-800"
                  }
                >
                  {user.role}
                </Badge>

                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleShow(user._id)}
                >
                  <Eye size={16} />
                </Button>

                <ConfirmDialog
                  title="Delete User?"
                  desc="This action cannot be undone."
                  actionLabel="Delete"
                  onConfirm={() => handleDelete(user._id)}
                  trigger={
                    <Button variant="destructive" size="sm">
                      <Trash size={16} />
                    </Button>
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------- DESKTOP TABLE ---------------- */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((user) => (
              <TableRow key={user._id}>
                <TableCell className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {user.fullName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {user._id}
                    </div>
                  </div>
                </TableCell>

                <TableCell>{user.email}</TableCell>

                <TableCell>
                  <Badge
                    className={
                      user.role === "admin"
                        ? "bg-yellow-100 text-yellow-800"
                        : user.role === "mechanic"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }
                  >
                    {user.role}
                  </Badge>
                </TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleShow(user._id)}
                      variant="ghost"
                      size="sm"
                    >
                      <Eye size={16} />
                    </Button>

                    <ConfirmDialog
                      title="Delete User?"
                      desc="This action cannot be undone."
                      actionLabel="Delete"
                      onConfirm={() => handleDelete(user._id)}
                      trigger={
                        <Button variant="destructive" size="sm">
                          <Trash size={16} />
                        </Button>
                      }
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
