// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/scrollbar'
import './styles.css'

// import required modules
import { Mousewheel, Pagination, Autoplay } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { HiOutlineX, HiOutlineXCircle, HiSearch, HiX } from 'react-icons/hi'
import React, { Fragment, useState } from 'react'
import { Input } from '@/components/ui'

// Import Swiper styles


function LandingPage() {
    const [isOpenMenuSearch, setIsOpenMenuSearch] = useState<boolean>(false)

    const Display: React.FC<{ title: string }> = ({ title }) => (
        <div className="absolute bottom-[23%] left-[8%] font-poppins text-white">
            <div className="max-w-[600px]">
                <h2 className="text-[30px] md:text-pretty unica-one-regular text-white">{title}</h2>
            </div>
            <div>
                <Link to="/" className="underline underline-offset-2">
                    Hãy tìm kiếm sở thích của bạn
                </Link>
            </div>
            <div className={`fixed bottom-[20px] left-1/2 -translate-x-1/2 -translate-y-1/2 ${isOpenMenuSearch ? "hidden": ""}`}>
                <button
                    className={'p-5 bg-white rounded-full text-black'}
                    onClick={() => setIsOpenMenuSearch(!isOpenMenuSearch)}
                >
                    <HiSearch
                        className={''}
                        size={30}
                    />
                </button>
            </div>

        </div>
    )

    return (
        <>
            <div
                className={`fixed w-full z-50 transition-all duration-500 bg-white opacity-60 bottom-0 ${isOpenMenuSearch ? '' : ' translate-y-full'}`}>
                <div className={'!flex !flex-col justify-center p-10 items-center'}>
                    <div className={'w-3/5'}>
                        <Input
                            className={'border-black border-2 !bg-white !opacity-100 text-black !rounded-none'}
                            placeholder={'Vui lòng nhập từ khóa'}
                            suffix={
                                <Fragment>
                                    <button>
                                        <HiSearch size={25}></HiSearch>
                                    </button>
                                </Fragment>
                            }
                        ></Input>
                    </div>
                    <div className={''}>
                        <button
                            className={'p-5 bg-white rounded-full text-black'}
                            onClick={() => setIsOpenMenuSearch(!isOpenMenuSearch)}
                        >
                            <HiOutlineXCircle
                                className={''}
                                size={40}
                            />
                        </button>
                    </div>
                </div>
            </div>
            <Swiper
                direction={'vertical'}
                slidesPerView={1}
                effect="fade"
                spaceBetween={0}
                speed={1500}
                mousewheel={true}
                pagination={{
                    clickable: true
                }}
                autoplay={{ delay: 5000 }}
                modules={[Mousewheel, Pagination, Autoplay]}
                className="mySwiper !h-svh w-full z-40"
            >
                <SwiperSlide
                    className={'!bg-no-repeat !bg-left-top !bg-cover !bg-fixed'}
                    style={{
                        backgroundImage: 'url("/res92b4f8c79267b29cf2b74eaa35d1068cfr.jpg")'
                    }}
                >
                    <Display title={'Hãy để mỗi ngày của bạn trở nên đặc biệt hơn '} />
                </SwiperSlide>
                <SwiperSlide
                    className={'!bg-no-repeat !bg-left-top !bg-cover !bg-fixed'}
                    style={{
                        backgroundImage: 'url("/res730d2838062b0cdbeffbc6ff8ce591e0fr.jpg")'
                    }}>
                    <Display title={'Chất lượng áo phông được thiết kế để bạn thoải mái cả ngày.'} />
                </SwiperSlide>
                <SwiperSlide
                    className={'!bg-no-repeat !bg-left-top !bg-cover !bg-fixed'}
                    style={{
                        backgroundImage: 'url("/res771f1f73d44489439cfc34fc857ffd5ffr.jpg")'
                    }}>
                    <Display title={'Lấy cảm hứng thiết kế tay ngắn từ thập niên năm 90.'} />
                </SwiperSlide>
            </Swiper>
        </>
    )
}

export default LandingPage