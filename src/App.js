import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Card,
  CardContent,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BarChartIcon from "@mui/icons-material/BarChart";

function App() {

  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [form, setForm] = useState({
    id: null,
    name: "",
    email: "",
    branch: "",
    year: ""
  });

  const [attendanceForm, setAttendanceForm] = useState({
    id: null,
    studentId: "",
    subject: "",
    percentage: ""
  });

  // 🔐 AUTO LOGIN USING TOKEN
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setUser(token);
    }
  }, []);

  // Load data after login
  useEffect(() => {
    if (user) {
      fetchStudents();
      fetchAttendance();
    }
  }, [user]);

  // ---------------- LOGIN ----------------

  if (!user) {
    return <Login onLogin={(token) => {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      setUser(token);
    }} />;
  }

  // ---------------- LOGOUT ----------------

  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setUser(null);
  };

  // ---------------- STUDENTS ----------------

  const fetchStudents = () => {
    axios.get("http://localhost:8080/students")
      .then(res => setStudents(res.data))
      .catch(() => alert("Failed to load students"));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveStudent = () => {
    const payload = { ...form, year: parseInt(form.year) };

    if (form.id) {
      axios.put(`http://localhost:8080/students/${form.id}`, payload)
        .then(() => {
          fetchStudents();
          setForm({ id: null, name: "", email: "", branch: "", year: "" });
        });
    } else {
      axios.post("http://localhost:8080/students", payload)
        .then(() => {
          fetchStudents();
          setForm({ id: null, name: "", email: "", branch: "", year: "" });
        });
    }
  };

  const editStudent = (s) => setForm(s);

  const deleteStudent = (id) => {
    axios.delete(`http://localhost:8080/students/${id}`)
      .then(() => fetchStudents());
  };

  // ---------------- ATTENDANCE ----------------

  const fetchAttendance = () => {
    axios.get("http://localhost:8080/attendance")
      .then(res => setAttendance(res.data));
  };

  const handleAttendanceChange = (e) => {
    setAttendanceForm({ ...attendanceForm, [e.target.name]: e.target.value });
  };

  const saveAttendance = () => {
    const payload = {
      ...attendanceForm,
      studentId: parseInt(attendanceForm.studentId),
      percentage: parseInt(attendanceForm.percentage)
    };

    if (attendanceForm.id) {
      axios.put(`http://localhost:8080/attendance/${attendanceForm.id}`, payload)
        .then(() => {
          fetchAttendance();
          setAttendanceForm({ id: null, studentId: "", subject: "", percentage: "" });
        });
    } else {
      axios.post("http://localhost:8080/attendance", payload)
        .then(() => {
          fetchAttendance();
          setAttendanceForm({ id: null, studentId: "", subject: "", percentage: "" });
        });
    }
  };

  const editAttendance = (a) => setAttendanceForm(a);

  const deleteAttendance = (id) => {
    axios.delete(`http://localhost:8080/attendance/${id}`)
      .then(() => fetchAttendance());
  };

  // ---------------- UI ----------------

  return (
    <>
      {/* NAVBAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            College ERP Dashboard
          </Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ marginTop: 4 }}>
        {/* DASHBOARD STATS */}
        <Card sx={{ marginBottom: 3, padding: 2 }}>
          <CardContent>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Welcome back, Admin 👋
            </Typography>

            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>

              <Card sx={{ flex: 1, padding: 2, background: "#e3f2fd" }}>
                <SchoolIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                <Typography variant="subtitle2">Total Students</Typography>
                <Typography variant="h4">{students.length}</Typography>
              </Card>

              <Card sx={{ flex: 1, padding: 2, background: "#e8f5e9" }}>
                <MenuBookIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
                <Typography variant="subtitle2">Subjects Tracked</Typography>
                <Typography variant="h4">
                  {new Set(attendance.map(a => a.subject)).size}
                </Typography>
              </Card>

              <Card sx={{ flex: 1, padding: 2, background: "#fff3e0" }}>
                <BarChartIcon sx={{ fontSize: 40, color: "#ef6c00" }} />
                <Typography variant="subtitle2">Average Attendance</Typography>
                <Typography variant="h4">
                  {attendance.length
                    ? Math.round(
                        attendance.reduce((acc, a) => acc + a.percentage, 0) /
                        attendance.length
                      )
                    : 0}%
                </Typography>
              </Card>

            </div>
          </CardContent>
        </Card>
        
        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Student Management
        </Typography>
        <hr style={{ marginBottom: "20px" }} />

        {/* STUDENT FORM */}
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6">
              {form.id ? "Update Student" : "Add Student"}
            </Typography>

            <TextField label="Name" name="name" value={form.name} onChange={handleChange} sx={{ m:1 }} />
            <TextField label="Email" name="email" value={form.email} onChange={handleChange} sx={{ m:1 }} />
            <TextField label="Branch" name="branch" value={form.branch} onChange={handleChange} sx={{ m:1 }} />
            <TextField label="Year" name="year" value={form.year} onChange={handleChange} sx={{ m:1 }} />

            <Button variant="contained" onClick={saveStudent}>
              {form.id ? "Update" : "Add"}
            </Button>
          </CardContent>
        </Card>

        {/* STUDENT TABLE */}
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6">Student List</Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {students.map(s => (
                  <TableRow key={s.id}>
                    <TableCell>{s.name}</TableCell>
                    <TableCell>{s.email}</TableCell>
                    <TableCell>{s.branch}</TableCell>
                    <TableCell>{s.year}</TableCell>
                    <TableCell>
                      <Button onClick={() => editStudent(s)}>Edit</Button>
                      <Button color="error" onClick={() => deleteStudent(s.id)}>Delete</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </CardContent>
        </Card>

        <Typography variant="h5" sx={{ marginBottom: 1 }}>
          Attendance Management
        </Typography>
        <hr style={{ marginBottom: "20px" }} />

        {/* ATTENDANCE FORM */}
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6">
              {attendanceForm.id ? "Update Attendance" : "Add Attendance"}
            </Typography>

            <FormControl sx={{ m: 1, minWidth: 300 }}>
              <InputLabel>Select Student</InputLabel>
              <Select
                name="studentId"
                value={attendanceForm.studentId}
                label="Select Student"
                onChange={handleAttendanceChange}
              >
                <MenuItem value="">
                  <em>Select Student</em>
                </MenuItem>
                {students.map((s) => (
                  <MenuItem key={s.id} value={s.id}>
                    {s.name} - {s.branch}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField label="Subject" name="subject" value={attendanceForm.subject} onChange={handleAttendanceChange} sx={{ m:1 }} />
            <TextField label="Percentage" name="percentage" value={attendanceForm.percentage} onChange={handleAttendanceChange} sx={{ m:1 }} />

            <Button variant="contained" onClick={saveAttendance}>
              {attendanceForm.id ? "Update" : "Add"}
            </Button>
          </CardContent>
        </Card>

        {/* ATTENDANCE TABLE */}
        <Card sx={{ marginBottom: 3 }}>
          <CardContent>
            <Typography variant="h6">Attendance List</Typography>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Subject</TableCell>
                  <TableCell>Percentage</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {Object.values(
                  attendance.reduce((acc, a) => {
                    if (!acc[a.studentId]) {
                      acc[a.studentId] = {
                        studentId: a.studentId,
                        subjects: []
                      };
                    }
                    acc[a.studentId].subjects.push(a);
                    return acc;
                  }, {})
                ).map(group => (
                  <TableRow key={group.studentId}>
                    <TableCell>
                      {students.find(s => s.id === group.studentId)?.name || group.studentId}
                    </TableCell>

                    <TableCell>
                      {group.subjects.map(sub => (
                        <div key={sub.id} style={{ marginBottom: "6px" }}>
                          <strong>{sub.subject}</strong>
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {group.subjects.map(sub => (
                        <div key={sub.id} style={{ marginBottom: "6px" }}>
                          {sub.percentage}%
                        </div>
                      ))}
                    </TableCell>

                    <TableCell>
                      {group.subjects.map(sub => (
                        <div key={sub.id}>
                          <Button size="small" onClick={() => editAttendance(sub)}>Edit</Button>
                          <Button size="small" color="error" onClick={() => deleteAttendance(sub.id)}>Delete</Button>
                        </div>
                      ))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

            </Table>
          </CardContent>
        </Card>

        <div style={{ textAlign: "center", marginTop: "40px", opacity: 0.6 }}>
          <Typography variant="body2">
            © 2026 College ERP Dashboard • Developed by Maneeth
          </Typography>
        </div>
      </Container>
    </>
  );
}
export default App;