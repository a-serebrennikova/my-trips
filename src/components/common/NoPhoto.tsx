export const NoPhotoLg = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
      <p className="text-standard font-semibold">Photo not uploaded</p>
      <p className="text-small">Add a photo to this trip card</p>
    </div>
  );
};

export const NoPhotoSm = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center rounded-xl bg-slate-200 text-small text-slate-500">
      No photo
    </div>
  );
};
