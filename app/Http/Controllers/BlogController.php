<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::latest()->get();
        return Inertia::render('Blogs/Index', [
            'blogs' => $blogs
        ]);
    }

    public function create()
    {
        return Inertia::render('Blogs/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:blogs',
            'description' => 'required',
        ]);

        Blog::create([
            'name' => $request->name,
            'slug' => $request->slug,
            'description' => $request->description,
            'user_id' => auth()->id(),
        ]);

        return redirect()->route('blogs.index')->with('success', 'Blog created successfully!');
    }

    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return Inertia::render('Blogs/Show', [
            'blog' => $blog
        ]);
    }

    public function edit($id)
    {
        $blog = Blog::findOrFail($id);
        return Inertia::render('Blogs/Edit', [
            'blog' => $blog
        ]);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'slug' => 'required|unique:blogs,slug,' . $id,
            'description' => 'required',
        ]);

        $blog = Blog::findOrFail($id);
        $blog->update($request->all());

        return redirect()->route('blogs.index')->with('success', 'Blog updated successfully!');
    }

    public function destroy($id)
    {
        $blog = Blog::findOrFail($id);
        $blog->delete();

        return redirect()->route('blogs.index')->with('success', 'Blog deleted successfully!');
    }
}
