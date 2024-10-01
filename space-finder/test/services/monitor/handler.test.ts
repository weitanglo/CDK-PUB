import { handler } from "../../../src/services/monitor/handler"


describe('Monitor lambda test', () => {

    const fechSpy = jest.spyOn(global, 'fetch'); // Track fetch calls after test starting
    fechSpy.mockImplementation(()=>Promise.resolve({} as any)); // make sure no http calls with replacing dummy implementation and no need to set return
    
    afterEach(()=>{
        jest.clearAllMocks();
    })

    test('makes request for records in SnsEvents',async () => {
        await handler({
            Records:[{
                Sns: {
                    Message: 'Test message'
                }
            }]
        } as any, {});

        // assert part
        expect(fechSpy).toHaveBeenCalledTimes(1); 
        expect(fechSpy).toHaveBeenCalledWith(expect.any(String), {
            method: 'POST',
            body: JSON.stringify({
                "test": `Japan, we have a problem: Test message`
            })
        })
    });

    test('No sns records, no requests',async () => {
        await handler({
            Records:[]
        } as any, {});

        // assert part
        expect(fechSpy).not.toHaveBeenCalled(); 
    });
})