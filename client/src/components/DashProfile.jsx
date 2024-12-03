import { Button, TextInput } from 'flowbite-react';
import { useSelector } from 'react-redux';

export default function DashProfile() {
    const { currentUser } = useSelector((state) => state.user);
    return (
        <div className='max-w-lg mx-auto p-3 w-full'>
            <form className='flex flex-col gap-4'>
                <div className='w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full'>
                    <img
                        src={currentUser.profilePicture}
                        alt='user'
                        className='rounded-full w-full h-full object-cover border-8 border-[#ffffff]'
                    />
                </div>
                <TextInput
                    type='text'
                    id='username'
                    placeholder='Enter new username'
                    defaultValue={currentUser.username}
                />
                <TextInput
                    type='email'
                    id='email'
                    placeholder='Enter new email'
                    defaultValue={currentUser.email}
                />
                <TextInput type='password' id='password' placeholder='Enter new password' />
                <Button type='submit' gradientDuoTone='tealToLime' outline>
                    Update My Profile
                </Button>
            </form>
            <div className="text-red-500 font-semibold flex justify-between mt-5">
                <span className='cursor-pointer'>Delete Account</span>
                <span className='cursor-pointer'>Sign Out</span>
            </div>
        </div>
    );
}