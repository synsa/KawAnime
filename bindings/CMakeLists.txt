cmake_minimum_required(VERSION 3.12.0 FATAL_ERROR)

# Name of the project (will be the name of the plugin)
project(kawabinds)

set(CMAKE_CXX_STANDARD 14)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_BUILD_TYPE Release)

# Windows things...
if (MSVC)
  if (MSVC_VERSION GREATER_EQUAL "1900")
    include(CheckCXXCompilerFlag)
    CHECK_CXX_COMPILER_FLAG("/std:c++14" _cpp_14_flag_supported)
    if (_cpp_14_flag_supported)
      add_compile_options("/std:c++14")
    endif(_cpp_14_flag_supported)
  endif(MSVC_VERSION GREATER_EQUAL "1900")

  # add_compile_definitions(_WIN32_WINNT 0x0A00)
  add_compile_definitions(WIN32_LEAN_AND_MEAN)
endif(MSVC)


# LibGCrypt
list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/lib/libtorrent/cmake/Modules)

# Boost
# list(APPEND CMAKE_MODULE_PATH ${CMAKE_CURRENT_SOURCE_DIR}/../node_modules/boost-lib/cmake)
# include(BoostLib)

# require_boost_libs(">= 1.69.0" "system;date_time")
# include_directories(${Boost_INCLUDE_DIRS})

# Essential include files to build a node addon,
# you should add this line in every CMake.js based project.
include_directories(${CMAKE_JS_INC})

# Build a shared library named after the project from the files in `src/`
file(
  GLOB
  SOURCE_FILES
  "src/*.cc" "src/*.h"
  "src/torrent/*.cc" "src/torrent/*.h"
  "src/name_parser/*.cc" "src/name_parser/*.h"

  "lib/anitomy/anitomy/*.cpp" "lib/anitomy/anitomy/*.h"
)
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES})

target_include_directories(${PROJECT_NAME} PRIVATE "lib/anitomy")

## Libtorrent
set(LIBTORRENT_DIR "lib/libtorrent")
add_subdirectory(${LIBTORRENT_DIR})

target_include_directories(${PROJECT_NAME} PRIVATE ${LIBTORRENT_DIR}/include)
target_link_libraries(${PROJECT_NAME} torrent-rasterbar)

# Include N-API wrappers
execute_process(COMMAND node -p "require('node-addon-api').include"
  WORKING_DIRECTORY ${CMAKE_SOURCE_DIR}
  OUTPUT_VARIABLE NODE_ADDON_API_DIR
)
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})

# Gives our library file a .node extension without any "lib" prefix
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")

if(MSVC)
  set_target_properties(${PROJECT_NAME} PROPERTIES LINK_FLAGS "/DELAYLOAD:node.exe" )
endif (MSVC)

# Essential include files to build a node addon,
# You should add this line in every CMake.js based project
target_include_directories(${PROJECT_NAME} PRIVATE ${CMAKE_JS_INC})

# Essential library files to link to a node addon
# You should add this line in every CMake.js based project
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB})
