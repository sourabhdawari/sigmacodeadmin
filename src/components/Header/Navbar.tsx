import { Fragment } from 'react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook'
import { headerClasses } from './headerClasses'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { logout } from '../../features/authSlice'
import { auth } from '../../firebase'



function classNames(...classes:any) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const location = useLocation();
  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Logos', href: '/logo', current: location.pathname === '/logo' },
    { name: 'Resume', href: '/resume', current: location.pathname === '/resume' },
    { name: 'Socialpost', href: '/socialposts', current: location.pathname === '/socialposts' },
    { name: 'Campaign', href: '/campaign', current: location.pathname === '/campaign' },
  ];
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { user } = useAppSelector((state) => state.auth);
    const { header, navContainer, navContent, linkSignIn, linkProfile } =
    headerClasses;

    const handleLogout = async () => {
        await signOut(auth);
        dispatch(logout());
      };
  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }:any) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                  {navigation.map((item) => (
  <Link
    key={item.name}
    to={item.href}
    className={classNames(
      item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
      'rounded-md px-3 py-2 text-sm font-medium'
    )}
    aria-current={item.current ? 'page' : undefined}
  >
    {item.name}
  </Link>
))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Link to="/contacted">
                <button
                  type="button"
                  className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button>
                  </Link>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      {user ? (
              <Link to="/profile">
                {user?.photoUrl ? (
                  <img
                    className={linkProfile}
                    src={user.photoUrl}
                    alt="Avatar"
                  />
                ) : (
                  <div className="w-24 h-24 mb-3 text-4xl font-bold grid place-content-center bg-green-200 rounded-full shadow-lg">
                    {user?.email[0].toUpperCase()}
                  </div>
                )}
              </Link>
            ):<></>}
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {/* <Menu.Item>
                        {({ active }:any) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }:any) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item> */}

                      <Menu.Item>
                        {({ active }:any) => (
                          <div
                          onClick={handleLogout}
                            className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                          >
                            Sign out
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                    <Link to={item.href}>
                  {item.name}
                    </Link>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}