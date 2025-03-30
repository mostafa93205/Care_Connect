interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  password: string
  dateOfBirth: string
  gender: string
  phone: string
  address?: string
  emergencyContact?: string
  bloodType?: string
  insuranceProvider?: string
  insuranceNumber?: string
  registrationDate?: string
}

export const userStorage = {
  saveUser: (user: User) => {
    const users = userStorage.getUsers()
    users.push(user)
    localStorage.setItem("users", JSON.stringify(users))
  },
  getUsers: (): User[] => {
    const users = localStorage.getItem("users")
    return users ? JSON.parse(users) : []
  },
  getUserByEmail: (email: string): User | undefined => {
    return userStorage.getUsers().find((user) => user.email === email)
  },
  getUserById: (id: string): User | undefined => {
    return userStorage.getUsers().find((user) => user.id === id)
  },
  setCurrentUser: (user: Omit<User, "password">) => {
    localStorage.setItem("currentUser", JSON.stringify(user))
  },
  getCurrentUser: (): Omit<User, "password"> | null => {
    const user = localStorage.getItem("currentUser")
    return user ? JSON.parse(user) : null
  },
  clearCurrentUser: () => {
    localStorage.removeItem("currentUser")
  },
  login: (identifier: string, password: string): Omit<User, "password"> | null => {
    const users = userStorage.getUsers()
    const user = users.find((u) => (u.email === identifier || u.id === identifier) && u.password === password)
    if (user) {
      const { password, ...userWithoutPassword } = user
      userStorage.setCurrentUser(userWithoutPassword)
      return userWithoutPassword
    }
    return null
  },
  logout: () => {
    userStorage.clearCurrentUser()
  },
}

