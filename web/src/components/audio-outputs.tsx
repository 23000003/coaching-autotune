

export const AudioOutputs = () => {

    const rawWavFiles = "/uploads/raw/kenny/b27cdb6e-bd07-430a-b0eb-85a2cd184fac.wav";

    return (
        <div className="w-full max-w-5xl mx-auto">
            <div className="bg-card rounded-2xl p-8 border border-border shadow-2xl">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                    Output
                </h2>

                <hr className="bg-white" />  

                <div className="flex flex-row mt-4">
                    <div className="w-1/2 pr-4">
                        <p className="font-bold mb-2">Raw</p>
                        <audio controls src={rawWavFiles} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                    <div className="w-1/2 pl-4">
                        <p className="font-bold mb-2">Processed</p>
                        <audio controls src={rawWavFiles} className="w-full">
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                </div>
            </div>
        </div>
    );
};
