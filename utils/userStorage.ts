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
  updateUser: (id: string, updatedData: Partial<User>): boolean => {
    const users = userStorage.getUsers()
    const userIndex = users.findIndex((user) => user.id === id)

    if (userIndex === -1) return false

    // Don't allow changing the ID
    const { id: _, ...dataToUpdate } = updatedData

    // Update user data
    users[userIndex] = { ...users[userIndex], ...dataToUpdate }

    // Save updated users array
    localStorage.setItem("users", JSON.stringify(users))

    // If this is the current user, update current user as well
    const currentUser = userStorage.getCurrentUser()
    if (currentUser && currentUser.id === id) {
      const { password, ...userWithoutPassword } = users[userIndex]
      userStorage.setCurrentUser(userWithoutPassword)
    }

    return true
  },
  deleteUser: (id: string): boolean => {
    const users = userStorage.getUsers()
    const filteredUsers = users.filter((user) => user.id !== id)

    if (filteredUsers.length === users.length) return false

    localStorage.setItem("users", JSON.stringify(filteredUsers))

    // If this is the current user, log them out
    const currentUser = userStorage.getCurrentUser()
    if (currentUser && currentUser.id === id) {
      userStorage.clearCurrentUser()
    }

    return true
  },
  validatePassword: (id: string, password: string): boolean => {
    const user = userStorage.getUserById(id)
    return user ? user.password === password : false
  },
  changePassword: (id: string, currentPassword: string, newPassword: string): boolean => {
    if (!userStorage.validatePassword(id, currentPassword)) return false

    return userStorage.updateUser(id, { password: newPassword })
  },
}

