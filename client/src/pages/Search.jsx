import { Button, Select, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCard from '../components/PostCard';

export default function Search() {
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        sort: 'desc',
        category: 'uncategorized',
    });

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showMore, setShowMore] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const sortFromUrl = urlParams.get('sort');
        const categoryFromUrl = urlParams.get('category');
        if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                sort: sortFromUrl,
                category: categoryFromUrl,
            });
        }

        const fetchPosts = async () => {
            setLoading(true);
            const searchQuery = urlParams.toString();
            const res = await fetch(`/api/post/getposts?${searchQuery}`);
            if (!res.ok) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            setPosts(data.posts);
            setLoading(false);
            if (data.posts.length === 9) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
        };
        fetchPosts();
    }, [location.search]);

    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({ ...sidebarData, searchTerm: e.target.value });
        }
        if (e.target.id === 'sort') {
            const order = e.target.value || 'desc';
            setSidebarData({ ...sidebarData, sort: order });
        }
        if (e.target.id === 'category') {
            const category = e.target.value || 'uncategorized';
            setSidebarData({ ...sidebarData, category });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
            return;
        }
        const data = await res.json();
        setPosts([...posts, ...data.posts]);
        if (data.posts.length === 9) {
            setShowMore(true);
        } else {
            setShowMore(false);
        }
    };

    // Reset filters logic
    const handleResetFilters = () => {
        setSidebarData({
            searchTerm: '',
            sort: 'desc',
            category: 'uncategorized',
        });
        // Clear the URL search parameters and navigate to show all posts
        const resetParams = new URLSearchParams();
        navigate(`/search?${resetParams.toString()}`);
    };

    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500 w-full md:w-1/3">
                <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                    {/* Search Term Section */}
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                        <label className="font-semibold w-full md:w-1/3">Search Term:</label>
                        <TextInput
                            placeholder="Search..."
                            id="searchTerm"
                            type="text"
                            value={sidebarData.searchTerm}
                            onChange={handleChange}
                            className="w-full md:w-2/3"
                        />
                    </div>

                    {/* Sort Section */}
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                        <label className="font-semibold w-full md:w-1/3">Sort:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.sort}
                            id="sort"
                            className="w-full md:w-2/3"
                        >
                            <option value="desc">Latest</option>
                            <option value="asc">Oldest</option>
                        </Select>
                    </div>

                    {/* Category Section */}
                    <div className="flex flex-col md:flex-row items-center gap-2 w-full">
                        <label className="font-semibold w-full md:w-1/3">Category:</label>
                        <Select
                            onChange={handleChange}
                            value={sidebarData.category}
                            id="category"
                            className="w-full md:w-2/3"
                        >
                            <option value="uncategorized">Uncategorized</option>
                            <option value="reactjs">React.js</option>
                            <option value="nextjs">Next.js</option>
                            <option value="javascript">JavaScript</option>
                        </Select>
                    </div>

                    {/* Apply Filters Button */}
                    <div className="flex justify-center w-full mt-4">
                        <Button type="submit" outline gradientDuoTone="tealToLime" className="w-full md:w-2/3">
                            Apply Filters
                        </Button>
                    </div>
                </form>

                {/* Reset Filters Button */}
                <div className="flex justify-center w-full mt-4">
                    <Button
                        onClick={handleResetFilters}
                        outline
                        color="gray"
                        className="w-full md:w-2/3 flex items-center justify-center"
                    >
                        Reset Filters
                    </Button>
                </div>
            </div>

            <div className='w-full'>
                <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>
                    Posts results:
                </h1>
                <div className='p-7 flex flex-wrap gap-4'>
                    {!loading && posts.length === 0 && (
                        <p className='text-xl text-gray-500'>No posts found.</p>
                    )}
                    {loading && <p className='text-xl text-gray-500'>Loading...</p>}
                    {!loading &&
                        posts &&
                        posts.map((post) => <PostCard key={post._id} post={post} />)}
                    {showMore && (
                        <button
                            onClick={handleShowMore}
                            className='text-teal-500 text-lg hover:underline p-7 w-full'
                        >
                            Show More
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}