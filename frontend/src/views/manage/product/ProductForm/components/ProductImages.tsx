import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store';
import { HiEye, HiTrash } from 'react-icons/hi';
import { updateProductImagesByColor } from '../store';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import Dialog from '@/components/ui/Dialog';
import Upload from '@/components/ui/Upload';
import DoubleSidedImage from '@/components/shared/DoubleSidedImage';
import { Image } from '../store'; // Đảm bảo kiểu Image được định nghĩa đúng trong project của bạn

type ProductImagesProps = {
    colorName: string; // Tên màu sắc của sản phẩm
};

const ImageList = ({ imgList, onImageDelete }: { imgList: Image[]; onImageDelete: (img: Image) => void }) => {
    const [selectedImg, setSelectedImg] = useState<Image | null>(null);
    const [viewOpen, setViewOpen] = useState(false);
    const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);

    const onViewOpen = (img: Image) => {
        setSelectedImg(img);
        setViewOpen(true);
    };

    const onDialogClose = () => {
        setViewOpen(false);
        setTimeout(() => setSelectedImg(null), 300);
    };

    const onDeleteConfirmation = (img: Image) => {
        setSelectedImg(img);
        setDeleteConfirmationOpen(true);
    };

    const onDeleteConfirmationClose = () => {
        setSelectedImg(null);
        setDeleteConfirmationOpen(false);
    };

    const onDelete = () => {
        if (selectedImg) {
            onImageDelete(selectedImg);
        }
        setDeleteConfirmationOpen(false);
    };

    return (
        <>
            {imgList.map((img) => (
                <div key={img.id} className="group relative rounded border p-2 flex justify-center items-center">
                    <img
                        className="rounded object-cover max-h-[120px] max-w-full"
                        src={img.url}
                        alt={img.url}
                    />
                    <div className="absolute inset-2 bg-gray-900/[.7] group-hover:flex hidden text-xl items-center justify-center">
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onViewOpen(img)}
                        >
                            <HiEye />
                        </span>
                        <span
                            className="text-gray-100 hover:text-gray-300 cursor-pointer p-1.5"
                            onClick={() => onDeleteConfirmation(img)}
                        >
                            <HiTrash />
                        </span>
                    </div>
                </div>

            ))}
            <Dialog isOpen={viewOpen} onClose={onDialogClose} onRequestClose={onDialogClose}>
                <h5 className="mb-4">{selectedImg?.code}</h5>
                <img className="w-full" src={selectedImg?.url} alt={selectedImg?.url} />
            </Dialog>
            <ConfirmDialog
                isOpen={deleteConfirmationOpen}
                type="danger"
                title="Remove image"
                confirmButtonColor="red-600"
                onClose={onDeleteConfirmationClose}
                onRequestClose={onDeleteConfirmationClose}
                onCancel={onDeleteConfirmationClose}
                onConfirm={onDelete}
            >
                <p>Are you sure you want to remove this image?</p>
            </ConfirmDialog>
        </>
    );
};

const ProductImages = ({ colorName }: ProductImagesProps) => {
    const dispatch = useAppDispatch();
    const products = useAppSelector((state) => state.dataDetailedProduct.detailedProduct.data);

    // Tìm tất cả các sản phẩm có màu sắc tương ứng
    const matchingProducts = products.filter(product => product.color?.name === colorName);

    // Ensure productImages is always an array
    const productImages = matchingProducts[0]?.images ?? [];

    const beforeUpload = (file: FileList | null) => {
        const allowedFileTypes = ['image/jpeg', 'image/png'];
        const maxFileSize = 500000; // 500KB

        if (file) {
            for (const f of file) {
                if (!allowedFileTypes.includes(f.type)) {
                    return 'Please upload a .jpeg or .png file!';
                }
                if (f.size >= maxFileSize) {
                    return 'Upload image cannot exceed 500KB!';
                }
            }
        }
        return true;
    };

    const handleUpload = (files: File[] | null) => {
        if (!files) return;

        // Chuyển đổi các file thành array các đối tượng Image
        const newImages: Image[] = files.map((file, index) => ({
            id: Date.now() + index,  // id should be unique
            code: file.name,         // dùng tên file (code) làm thuộc tính nhận diện
            url: URL.createObjectURL(file),  // blob URL
            deleted: false,
            createdDate: new Date().toISOString(),
            modifiedDate: new Date().toISOString(),
        }));

        // Kiểm tra và loại bỏ các ảnh trùng lặp, cũng như ảnh đã xóa
        const updatedImages = [
            ...productImages.filter(img => !img.deleted),  // Loại bỏ ảnh bị xóa
            ...newImages.filter(newImg =>
                !productImages.some(existingImg =>
                    existingImg.code === newImg.code && !existingImg.deleted
                )
            )
        ];

        // Cập nhật Redux state với danh sách ảnh đã loại bỏ trùng lặp
        dispatch(updateProductImagesByColor({ colorName, images: updatedImages }));
    };

    const handleImageDelete = (deletedImg: Image) => {
        const updatedImages = productImages.filter(img => img.id !== deletedImg.id);
        dispatch(updateProductImagesByColor({ colorName, images: updatedImages }));
    };

    return (
        <div className="mb-4 grid ">
            <div className="text-center">
                <h5 className='mb-3'>Thêm ảnh cho sản phẩm màu {colorName} </h5>
                {productImages.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                        {/* Hiển thị danh sách ảnh nếu có */}
                        <ImageList imgList={productImages} onImageDelete={handleImageDelete} />

                        {/* Upload mới ảnh */}
                        <Upload
                            draggable
                            beforeUpload={beforeUpload}
                            showList={false}
                            onChange={(info) => handleUpload(info)} // Assuming `info` is an array of `File`
                        >
                            <div className="max-w-full flex flex-col px-4 py-2 justify-center items-center">
                                <DoubleSidedImage
                                    src="/img/others/upload.png"
                                    darkModeSrc="/img/others/upload-dark.png"
                                />
                                <p className="font-semibold text-center text-gray-800 dark:text-white">Tải lên </p>
                            </div>
                        </Upload>
                    </div>
                ) : (
                        <Upload
                            draggable
                            beforeUpload={beforeUpload}
                            showList={false}
                            onChange={(info) => handleUpload(info)} 
                        >
                            <div className=" text-center">
                                <DoubleSidedImage
                                    className="mx-auto"
                                    src="/img/others/upload.png"
                                    darkModeSrc="/img/others/upload-dark.png"
                                />
                                <p className="font-semibold">
                                    <span className="text-gray-800 dark:text-white">
                                        Thả hình ảnh của bạn ở đây, hoặc{' '}
                                    </span>
                                    <span className="text-blue-500">
                                        duyệt 
                                    </span>
                                </p>
                                <p className="mt-1 opacity-60 dark:text-white">
                                    Hỗ trợ: jpeg, png
                                </p>
                            </div>
                        </Upload>
                )}
            </div>
        </div>
    );
};

export default ProductImages;
