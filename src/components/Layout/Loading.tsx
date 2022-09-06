export default function Loading(props: { loading: boolean }) {
  if (props.loading)
    return (
      <div className="absolute w-screen h-screen z-50 backdrop-blur-3xl">
        <div className="w-screen h-screen flex justify-center items-center">
          <div className="lds-dual-ring" />
        </div>
      </div>
    )

  return <></>
}
