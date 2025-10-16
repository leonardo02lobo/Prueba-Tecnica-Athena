<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\Contract;

class ContractController extends Controller
{
    /**
     * @OA\Get(
     *     path="/contracts",
     *     tags={"Contracts"},
     *     summary="Get all contracts",
     *     operationId="getContracts",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Contracts retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="user_id", type="integer"),
     *                     @OA\Property(property="contract_number", type="string"),
     *                     @OA\Property(property="start_date", type="string", format="date"),
     *                     @OA\Property(property="status", type="string", enum={"active", "suspended", "cancelled"}),
     *                     @OA\Property(property="services", type="array", @OA\Items(type="object"))
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $contracts = Contract::with('services')->get();

        return response()->json([
            'success' => true,
            'data' => $contracts
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/contract/create",
     *     tags={"Contracts"},
     *     summary="Create a new contract",
     *     operationId="createContract",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"contract_number","start_date","status"},
     *             @OA\Property(property="contract_number", type="string", example="CONT-001"),
     *             @OA\Property(property="start_date", type="string", format="date", example="2023-01-01"),
     *             @OA\Property(property="status", type="string", enum={"active", "suspended", "cancelled"}, example="active")
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Contract created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Contract created successfully"),
     *             @OA\Property(property="contract", type="object"),
     *             @OA\Property(property="status", type="integer", example=201)
     *         )
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=500,
     *         description="Server error"
     *     )
     * )
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'contract_number' => 'required|string|unique:contracts',
            'start_date' => 'required|date',
            'status' => 'required|string|in:active,suspended,cancelled'
        ]);

        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        try {
            $contract = Contract::create([
                'user_id' => auth()->id(),
                'contract_number' => $request->contract_number,
                'start_date' => $request->start_date,
                'status' => $request->status
            ]);

            return response()->json([
                'message' => 'Contract created successfully',
                'contract' => $contract,
                'status' => 201
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Serve Error',
                'error' => $e->getMessage(),
                'status' => 500
            ], 500);
        }
    }

    /**
     * @OA\Get(
     *     path="/contract/{id}",
     *     tags={"Contracts"},
     *     summary="Get contract by ID",
     *     operationId="getContract",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contract retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="contract", type="object"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Contract not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        $contract = Contract::find($id);

        if(!$contract)
        {
            return response()->json([
                'message' => 'Contract not found',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'contract' => $contract,
            'status' => 200
        ],200);
    }

    /**
     * @OA\Put(
     *     path="/contract/{id}",
     *     tags={"Contracts"},
     *     summary="Update contract",
     *     operationId="updateContract",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"contract_number","start_date","status"},
     *             @OA\Property(property="contract_number", type="string"),
     *             @OA\Property(property="start_date", type="string", format="date"),
     *             @OA\Property(property="status", type="string", enum={"active", "suspended", "cancelled"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contract updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Contract updated successfully"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $contract = Contract::find($id);

        if(!$contract)
        {
            return response()->json([
                'message' => 'Contract not found',
                'status' => 404
            ], 404);
        }

        $validator = Validator::make($request->all(),[
            'contract_number' => 'required|string',
            'start_date' => 'required|date',
            'status' => 'required|string|in:active,suspended,cancelled'
        ]);

        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        $contract->contract_number = $request->contract_number;
        $contract->start_date = $request->start_date;
        $contract->status = $request->status;

        $contract->save();
        return response()->json([
            'message' => 'Contract updated successfully',
            'status' => 200
        ],200);
    }

    /**
     * @OA\Patch(
     *     path="/contract/{id}",
     *     tags={"Contracts"},
     *     summary="Partially update contract",
     *     operationId="updateContractPartial",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="contract_number", type="string"),
     *             @OA\Property(property="start_date", type="string", format="date"),
     *             @OA\Property(property="status", type="string", enum={"active", "suspended", "cancelled"})
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contract updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Contract updated successfully"),
     *             @OA\Property(property="contract", type="object"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     )
     * )
     */
    public function updatePartial(Request $request, string $id)
    {
        $contract = Contract::find($id);

        if(!$contract)
        {
            return response()->json([
                'message' => 'Contract not found',
                'status' => 404
            ], 404);
        }

        $data = $request->only(['contract_number', 'start_date', 'status']);

        $validator = Validator::make($request->all(),[
            'contract_number' => 'string',
            'start_date' => 'date',
            'status' => 'string|in:active,suspended,cancelled'
        ]);

        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }

        if (isset($data['contract_number'])) {
            $contract->contract_number = $data['contract_number'];
        }
        if (isset($data['start_date'])) {
            $contract->start_date = $data['start_date'];
        }
        if (isset($data['status'])) {
            $contract->status = $data['status'];
        }

        $contract->save();

        return response()->json([
            'message' => 'Contract updated successfully',
            'contract' => $contract,
            'status' => 200
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/contract/{id}",
     *     tags={"Contracts"},
     *     summary="Delete contract",
     *     operationId="deleteContract",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Contract deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Contract deleted successfully"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Contract not found"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $contract = Contract::find($id);

        if(!$contract){
            return response()->json([
                'message' => 'contract not found',
                'status' => 404
            ],404);
        }
        $contract->delete();

        return response()->json([
            'message' => 'Contract deleted successfully',
            'status' => 200
        ],200);
    }
}
