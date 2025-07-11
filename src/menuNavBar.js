import { mdiLogout, mdiThemeLightDark } from '@mdi/js'

export default [
  {
    label: 'Projects',
    to: '/projects'
  },
  {
    icon: mdiThemeLightDark,
    label: 'Light/Dark',
    isDesktopNoLabel: true,
    isToggleLightDark: true
  },
  {
    isCurrentUser: true,
    menu: [
      {
        displayUsername: true
      },
      {
        icon: mdiLogout,
        label: 'Log Out',
        isLogout: true
      }
    ]
  }
]
