<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Service;
use Illuminate\Support\Facades\Validator;

class ServiceController extends Controller
{
    /**
     * @OA\Get(
     *     path="/services",
     *     tags={"Services"},
     *     summary="Get all services",
     *     operationId="getServices",
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Services retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer"),
     *                     @OA\Property(property="contract_id", type="integer"),
     *                     @OA\Property(property="type", type="string"),
     *                     @OA\Property(property="plan_name", type="string"),
     *                     @OA\Property(property="price", type="number", format="float"),
     *                     @OA\Property(property="created_at", type="string", format="date-time"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time")
     *                 )
     *             )
     *         )
     *     )
     * )
     */
    public function index()
    {
        $services = Service::all();
        return response()->json([
            'success' => true,
            'data' => $services
        ], 200);
    }

    /**
     * @OA\Post(
     *     path="/service/create",
     *     tags={"Services"},
     *     summary="Create a new service",
     *     operationId="createService",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"contract_id","type","plan_name","price"},
     *             @OA\Property(property="contract_id", type="integer", example=1),
     *             @OA\Property(property="type", type="string", example="Internet"),
     *             @OA\Property(property="plan_name", type="string", example="Basic Plan"),
     *             @OA\Property(property="price", type="number", format="float", example=29.99)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Service created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service created successfully"),
     *             @OA\Property(property="service", type="object"),
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
        $validator = Validator::make($request->all(), [
            'contract_id' => 'required|numeric',
            'type' => 'required|string',
            'plan_name' => 'required|string',
            'price' => 'required|decimal:2'
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

        $service = Service::create([
            'contract_id' => $request->contract_id,
            'type' => $request->type,
            'plan_name' => $request->plan_name,
            'price' => $request->price
        ]);

        if(!$service)
        {
            return response()->json([
                'message' => 'Error creating service',
                'status' => 500
            ],500);
        }

        return response()->json([
            'message' => 'Service created successfully',
            'service' => $service,
            'status' => 201
        ], 201);
    }

    /**
     * @OA\Get(
     *     path="/service/{id}",
     *     tags={"Services"},
     *     summary="Get service by ID",
     *     operationId="getService",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Service retrieved successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="service", type="object"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Service not found"
     *     )
     * )
     */
    public function show(string $id)
    {
        $service = Service::find($id);

        if(!$service)
        {
            return response()->json([
                'message' => 'Service not found',
                'status' => 404
            ], 404);
        }
        return response()->json([
            'service' => $service,
            'status' => 200
        ], 200);
    }

    /**
     * @OA\Put(
     *     path="/service/{id}",
     *     tags={"Services"},
     *     summary="Update service",
     *     operationId="updateService",
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
     *             required={"contract_id","type","plan_name","price"},
     *             @OA\Property(property="contract_id", type="integer"),
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="plan_name", type="string"),
     *             @OA\Property(property="price", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Service updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service updated successfully"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     )
     * )
     */
    public function update(Request $request, string $id)
    {
        $service = Service::find($id);

        if(!$service)
        {
            return response()->json([
                'message' => 'Service not found',
                'status' => 404
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'contract_id' => 'required|numeric',
            'type' => 'required|string',
            'plan_name' => 'required|string',
            'price' => 'required|decimal:2'
        ]);

        if($validator->fails())
        {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors(),
                'status' => 400
            ], 400);
        }
        $service->contract_id = $request->contract_id;
        $service->type = $request->type;
        $service->plan_name = $request->plan_name;
        $service->price = $request->price;

        $service->save();
        return response()->json([
            'message' => 'Service updated successfully',
            'status' => 200
        ], 200);
    }

    /**
     * @OA\Patch(
     *     path="/service/{id}",
     *     tags={"Services"},
     *     summary="Partially update service",
     *     operationId="updateServicePartial",
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
     *             @OA\Property(property="contract_id", type="integer"),
     *             @OA\Property(property="type", type="string"),
     *             @OA\Property(property="plan_name", type="string"),
     *             @OA\Property(property="price", type="number", format="float")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Service updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service updated successfully"),
     *             @OA\Property(property="service", type="object"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     )
     * )
     */
    public function updatePartial(Request $request,string $id)
    {
        $service = Service::find($id);

        if(!$service)
        {
            return response()->json([
                'message' => 'Service not found',
                'status' => 404
            ], 404);
        }

        $data = $request->only(['contract_id','type','plan_name','price']);

        $validator = Validator::make($request->all(), [
            'contract_id' => 'sometimes|required|numeric',
            'type' => 'sometimes|required|string',
            'plan_name' => 'sometimes|required|string',
            'price' => 'sometimes|required|decimal:2'
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

        if(isset($data['contract_id'])){
            $service->contract_id = $data['contract_id'];
        }
        if(isset($data['type'])){
            $service->type = $data['type'];
        }
        if(isset($data['plan_name'])){
            $service->plan_name = $data['plan_name'];
        }
        if(isset($data['price'])){
            $service->price = $data['price'];
        }

        $service->save();

        return response()->json([
            'message' => 'Service updated successfully',
            'service' => $service,
            'status' => 200
        ], 200);
    }

    /**
     * @OA\Delete(
     *     path="/service/{id}",
     *     tags={"Services"},
     *     summary="Delete service",
     *     operationId="deleteService",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Service deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Service deleted successfully"),
     *             @OA\Property(property="status", type="integer", example=200)
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Service not found"
     *     )
     * )
     */
    public function destroy(string $id)
    {
        $service = Service::find($id);

        if(!$service)
        {
            return response()->json([
                'message' => 'Service not found',
                'status' => 404
            ], 404);
        }
        $service->delete();
        return response()->json([
            'message' => 'Service deleted successfully',
            'status' => 200
        ], 200);
    }
}
